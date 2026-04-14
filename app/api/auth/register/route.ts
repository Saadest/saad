import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { getAuthCookieName, signSession } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (existing) {
    return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      password: await hashPassword(parsed.data.password),
      fullName: parsed.data.fullName,
      wallet: { create: {} },
    },
  });

  const token = signSession({ userId: user.id, email: user.email });
  const response = NextResponse.json({ user: { id: user.id, email: user.email, fullName: user.fullName } }, { status: 201 });

  response.cookies.set(getAuthCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
