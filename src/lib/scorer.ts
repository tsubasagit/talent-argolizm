// argolizm — market value scoring algorithm (mock / OSS skeleton)
// This file will become the core of the OSS algorithm.

export type GitHubProfile = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
};

export type TalentScore = {
  total: number;
  technical: number;
  achievement: number;
  growth: number;
  fit: number | null; // null = requires company data
};

export type ScorerInputs = {
  resumeText: string | null;
  github: GitHubProfile | null;
  portfolioUrls: string[];
};

/**
 * calculateMockScore — placeholder implementation of the argolizm algorithm.
 * All weights and logic here are intentionally simplified for prototype phase.
 * The real algorithm will incorporate NLP analysis on resumeText, commit history, etc.
 */
export function calculateMockScore(inputs: ScorerInputs): TalentScore {
  let technical = 40; // base
  let achievement = 40;
  let growth = 40;

  // Resume text contribution
  if (inputs.resumeText && inputs.resumeText.trim().length > 100) {
    achievement += 20;
    // crude keyword scoring — will be replaced with NLP
    const keywords = [
      "設計",
      "アーキテクチャ",
      "リード",
      "マネジメント",
      "改善",
      "最適化",
      "開発",
      "実装",
      "TypeScript",
      "React",
      "Next.js",
      "Go",
      "Rust",
      "Python",
    ];
    const matched = keywords.filter((kw) =>
      inputs.resumeText!.includes(kw)
    ).length;
    technical += Math.min(15, matched * 2);
  }

  // GitHub contribution
  if (inputs.github) {
    technical += Math.min(25, inputs.github.public_repos);
    growth += Math.min(15, Math.floor(inputs.github.followers / 5));
    // Activity signal from repo count
    if (inputs.github.public_repos > 20) growth += 5;
  }

  // Portfolio contribution
  const validUrls = inputs.portfolioUrls.filter((u) => u.trim().length > 0);
  if (validUrls.length > 0) {
    achievement += Math.min(20, 10 * validUrls.length);
    technical += 5;
  }

  const total = Math.round((technical + achievement + growth) / 3);

  return {
    total: Math.min(100, total),
    technical: Math.min(100, technical),
    achievement: Math.min(100, achievement),
    growth: Math.min(100, growth),
    fit: null, // requires company data
  };
}

/**
 * scoreToSalaryRange — converts a total score to an estimated monthly unit price range (JPY).
 * Placeholder formula; real version will factor in skill stack, location, etc.
 */
export function scoreToSalaryRange(score: number): {
  min: number;
  max: number;
} {
  const base = 400_000;
  const step = 10_000;
  const min = base + Math.floor(score / 10) * step * 3;
  const max = min + 200_000;
  return { min, max };
}
