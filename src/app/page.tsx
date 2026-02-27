"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { ResumeUploader } from "@/components/ResumeUploader";
import { GitHubSection } from "@/components/GitHubSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { ScoreResult } from "@/components/ScoreResult";
import {
  calculateMockScore,
  type GitHubProfile,
  type TalentScore,
} from "@/lib/scorer";

export default function HomePage() {
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [githubProfile, setGithubProfile] = useState<GitHubProfile | null>(null);
  const [portfolioUrls, setPortfolioUrls] = useState<string[]>([""]);

  const [isCalculating, setIsCalculating] = useState(false);
  const [score, setScore] = useState<TalentScore | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const canCalculate =
    resumeText !== null ||
    githubProfile !== null ||
    portfolioUrls.some((u) => u.trim().length > 0);

  const handleCalculate = async () => {
    setIsCalculating(true);
    setScore(null);

    // Simulate async processing (future: real API call)
    await new Promise((r) => setTimeout(r, 1500));

    const result = calculateMockScore({
      resumeText,
      github: githubProfile,
      portfolioUrls,
    });

    setScore(result);
    setIsCalculating(false);

    // Scroll to result
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="border-b border-border bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-4 py-5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              argolizm
            </h1>
            <Badge
              color="var(--secondary)"
              bgColor="var(--border)"
              className="text-xs"
            >
              prototype
            </Badge>
          </div>
          <p className="mt-1 text-sm text-secondary">
            クリエイティブ職の市場価値を算定するオープンアルゴリズム —
            PDF職歴書・GitHub・ポートフォリオから総合スコアを算出します
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-3xl px-4 py-8 space-y-5">
        {/* Step 1: Resume */}
        <Card title="1. 職歴書 (PDF)">
          <ResumeUploader onExtract={setResumeText} />
        </Card>

        {/* Step 2: GitHub */}
        <Card title="2. GitHub">
          <GitHubSection onFetch={setGithubProfile} />
        </Card>

        {/* Step 3: Portfolio */}
        <Card title="3. ポートフォリオ">
          <PortfolioSection urls={portfolioUrls} onChange={setPortfolioUrls} />
        </Card>

        {/* Calculate button */}
        <div className="flex flex-col items-center gap-3">
          {!canCalculate && (
            <p className="text-sm text-secondary">
              職歴書・GitHub・ポートフォリオのいずれかを入力してください
            </p>
          )}
          <Button
            size="lg"
            onClick={handleCalculate}
            disabled={!canCalculate || isCalculating}
            className="w-full sm:w-auto sm:min-w-48"
          >
            {isCalculating ? (
              <>
                <Spinner size="sm" />
                スコアを算出中...
              </>
            ) : (
              "スコアを算出する"
            )}
          </Button>
        </div>

        {/* Score result */}
        {score && (
          <div ref={resultRef}>
            <Card title="算出結果">
              <ScoreResult score={score} />
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border py-6 text-center text-xs text-secondary">
        <p>
          argolizm — TalentFlow サポートツール |{" "}
          <a
            href="https://github.com/AppTalentHub"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary hover:underline"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
