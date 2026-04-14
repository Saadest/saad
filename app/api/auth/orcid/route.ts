import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { getOrcidAuthorizeUrl } from '@/lib/orcid';

export async function GET() {
  const state = randomUUID();
  const authorizeUrl = getOrcidAuthorizeUrl(state);
  const response = NextResponse.redirect(authorizeUrl);

  response.cookies.set('orcid_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  });

  return response;
}
