import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/api-auth';
import { calculateFeedScore } from '@/lib/reputation';

const createSchema = z.object({
  title: z.string().min(8),
  content: z.string().min(40),
});

export async function GET() {
  const articles = await prisma.article.findMany({
    include: {
      author: { select: { id: true, fullName: true, reputationScore: true, isVerified: true } },
      reviews: true,
      _count: { select: { comments: true, reviews: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const ranked = articles
    .map((article) => ({
      ...article,
      rankingScore: calculateFeedScore({
        votes: article.votes,
        reviewsCount: article._count.reviews,
        authorReputation: article.author.reputationScore,
        createdAt: article.createdAt,
      }),
    }))
    .sort((a, b) => b.rankingScore - a.rankingScore);

  return NextResponse.json({ items: ranked });
}

export async function POST(request: NextRequest) {
  const user = await requireUser(request);

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Payload inválido', details: parsed.error.flatten() }, { status: 400 });
  }

  const article = await prisma.article.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      authorId: user.id,
    },
  });

  return NextResponse.json({ article }, { status: 201 });
}
