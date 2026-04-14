import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/api-auth';

const schema = z.object({
  articleId: z.string().min(1),
  content: z.string().min(3).max(2000),
});

export async function POST(request: NextRequest) {
  const user = await requireUser(request);

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Comentario inválido' }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      articleId: parsed.data.articleId,
      userId: user.id,
      content: parsed.data.content,
    },
    include: {
      user: { select: { id: true, fullName: true, isVerified: true } },
    },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
