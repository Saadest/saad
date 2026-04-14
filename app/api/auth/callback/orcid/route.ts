import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exchangeOrcidCode, extractOrcidFullName, fetchOrcidPerson } from '@/lib/orcid';
import { getAuthCookieName, signSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const stateCookie = request.cookies.get('orcid_state')?.value;

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return NextResponse.json({ error: 'Callback ORCID inválido' }, { status: 400 });
  }

  const tokenPayload = await exchangeOrcidCode(code);
  const orcidId = tokenPayload.orcid;

  if (!orcidId || !tokenPayload.access_token) {
    return NextResponse.json({ error: 'No se recibió ORCID ID' }, { status: 400 });
  }

  const person = await fetchOrcidPerson(orcidId, tokenPayload.access_token);
  const fullName = extractOrcidFullName(person);

  const user = await prisma.user.upsert({
    where: { orcidId },
    create: {
      email: `${orcidId.replace(/-/g, '')}@orcid.local`,
      orcidId,
      fullName,
      orcidData: JSON.stringify({ token: tokenPayload, person }),
      isVerified: true,
      wallet: { create: {} },
    },
    update: {
      fullName,
      isVerified: true,
      orcidData: JSON.stringify({ token: tokenPayload, person }),
    },
  });

  const sessionToken = signSession({ userId: user.id, email: user.email });
  const redirectUrl = process.env.AUTH_SUCCESS_REDIRECT ?? '/';
  const response = NextResponse.redirect(new URL(redirectUrl, request.url));

  response.cookies.set(getAuthCookieName(), sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.delete('orcid_state');

  return response;
}
