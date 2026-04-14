import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const AUTH_COOKIE = 'nova_session';

export type SessionPayload = {
  userId: string;
  email: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET no configurado');
  }

  return secret;
}

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function readSessionToken(req: NextRequest): string | null {
  const bearer = req.headers.get('authorization');

  if (bearer?.startsWith('Bearer ')) {
    return bearer.replace('Bearer ', '').trim();
  }

  return req.cookies.get(AUTH_COOKIE)?.value ?? null;
}

export function verifySession(token: string): SessionPayload {
  return jwt.verify(token, getJwtSecret()) as SessionPayload;
}

export function getAuthCookieName() {
  return AUTH_COOKIE;
}
