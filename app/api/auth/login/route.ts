import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { getAuthCookieName, signSession } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (!user?.password) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  const valid = await verifyPassword(parsed.data.password, user.password);

  if (!valid) {
    return NextResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 });
  }

  const token = signSession({ userId: user.id, email: user.email });
  const response = NextResponse.json({ user: { id: user.id, email: user.email, fullName: user.fullName } });

  response.cookies.set(getAuthCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
