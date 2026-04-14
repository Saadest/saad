export type ReputationInput = {
  reviewScore: number;
  engagementScore: number;
  citationScore: number;
  isOrcidVerified: boolean;
};

const WEIGHTS = {
  review: 0.4,
  engagement: 0.2,
  citations: 0.2,
  orcid: 0.2,
};

export function calculateReputation(input: ReputationInput): number {
  const normalizedOrcid = input.isOrcidVerified ? 100 : 0;

  const score =
    input.reviewScore * WEIGHTS.review +
    input.engagementScore * WEIGHTS.engagement +
    input.citationScore * WEIGHTS.citations +
    normalizedOrcid * WEIGHTS.orcid;

  return Number(score.toFixed(2));
}

export function calculateArticleScore(clarity: number, rigor: number, utility: number): number {
  return Number(((clarity + rigor + utility) / 3).toFixed(2));
}

export function calculateFeedScore(input: {
  votes: number;
  reviewsCount: number;
  authorReputation: number;
  createdAt: Date;
}): number {
  const ageHours = Math.max((Date.now() - input.createdAt.getTime()) / (1000 * 60 * 60), 1);
  const recency = 1 / ageHours;

  return Number((input.votes * 0.35 + input.reviewsCount * 0.3 + input.authorReputation * 0.25 + recency * 10).toFixed(3));
}
