import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import { readSessionToken, verifySession } from './auth';

export async function requireUser(request: NextRequest) {
  const token = readSessionToken(request);

  if (!token) {
    return null;
  }

  try {
    const session = verifySession(token);
    return prisma.user.findUnique({ where: { id: session.userId } });
  } catch {
    return null;
  }
}
