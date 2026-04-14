import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/api-auth';
import { calculateArticleScore } from '@/lib/reputation';

const schema = z.object({
  articleId: z.string().min(1),
  clarity: z.number().min(1).max(5),
  rigor: z.number().min(1).max(5),
  utility: z.number().min(1).max(5),
});

export async function POST(request: NextRequest) {
  const user = await requireUser(request);

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos de review inválidos' }, { status: 400 });
  }

  const review = await prisma.review.upsert({
    where: { articleId_userId: { articleId: parsed.data.articleId, userId: user.id } },
    update: {
      clarity: parsed.data.clarity,
      rigor: parsed.data.rigor,
      utility: parsed.data.utility,
    },
    create: {
      articleId: parsed.data.articleId,
      userId: user.id,
      clarity: parsed.data.clarity,
      rigor: parsed.data.rigor,
      utility: parsed.data.utility,
    },
  });

  const all = await prisma.review.findMany({ where: { articleId: parsed.data.articleId } });
  const averages = all.reduce(
    (acc, r) => {
      acc.clarity += r.clarity;
      acc.rigor += r.rigor;
      acc.utility += r.utility;
      return acc;
    },
    { clarity: 0, rigor: 0, utility: 0 },
  );

  const count = all.length || 1;

  return NextResponse.json({
    review,
    score: calculateArticleScore(averages.clarity / count, averages.rigor / count, averages.utility / count),
  });
}
