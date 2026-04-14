import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateReputation } from '@/lib/reputation';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId es requerido' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      reviews: true,
      comments: true,
      articles: {
        include: {
          reviews: true,
          comments: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  const peerReviewScore = user.reviews.length
    ? (user.reviews.reduce((acc, review) => acc + (review.clarity + review.rigor + review.utility) / 3, 0) / user.reviews.length) * 20
    : 0;

  const engagementScore = Math.min(user.comments.length * 5 + user.articles.length * 10, 100);

  const citationScore = 0;

  const reputation = calculateReputation({
    reviewScore: peerReviewScore,
    engagementScore,
    citationScore,
    isOrcidVerified: user.isVerified,
  });

  await prisma.user.update({ where: { id: user.id }, data: { reputationScore: reputation } });

  return NextResponse.json({
    userId: user.id,
    reputation,
    breakdown: {
      peerReviewScore,
      engagementScore,
      citationScore,
      orcidBonus: user.isVerified ? 100 : 0,
    },
  });
}
