"use client";

import type { TalentScore } from "@/lib/scorer";
import { scoreToSalaryRange } from "@/lib/scorer";

type ScoreResultProps = {
  score: TalentScore;
};

const AXES: {
  key: keyof Omit<TalentScore, "total" | "fit">;
  label: string;
  color: string;
}[] = [
  { key: "technical", label: "技術力", color: "var(--primary)" },
  { key: "achievement", label: "実績", color: "var(--success)" },
  { key: "growth", label: "成長性", color: "var(--warning)" },
];

function ProgressBar({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-border">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function ScoreResult({ score }: ScoreResultProps) {
  const { min, max } = scoreToSalaryRange(score.total);

  const totalColor =
    score.total >= 80
      ? "text-success"
      : score.total >= 60
        ? "text-primary"
        : "text-warning";

  return (
    <div className="space-y-5">
      {/* Mock warning */}
      <div className="flex items-start gap-2 rounded-lg border border-warning bg-warning-light p-3">
        <span className="mt-0.5 shrink-0 text-warning" aria-hidden>
          ⚠️
        </span>
        <p className="text-sm text-foreground">
          これはモックスコアです。実際のアルゴリズムは現在開発中です。入力内容に基づく概算値のみ表示しています。
        </p>
      </div>

      {/* Total score */}
      <div className="text-center">
        <p className="text-sm font-medium text-secondary">総合スコア</p>
        <p className={`text-6xl font-bold leading-none ${totalColor}`}>
          {score.total}
        </p>
        <p className="mt-1 text-sm text-secondary">/ 100</p>
      </div>

      {/* Axis breakdown */}
      <div className="space-y-3">
        {AXES.map(({ key, label, color }) => (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{label}</span>
              <span className="tabular-nums text-secondary">{score[key]}</span>
            </div>
            <ProgressBar value={score[key]} color={color} />
          </div>
        ))}

        {/* Fit score — placeholder */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-secondary">フィット度</span>
            <span className="text-xs text-secondary italic">企業情報が必要</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full w-0 rounded-full bg-border" />
          </div>
        </div>
      </div>

      {/* Salary range */}
      <div className="rounded-lg border border-border bg-muted p-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-secondary">
          推定月額単価レンジ
        </p>
        <p className="mt-1 text-2xl font-bold text-foreground">
          ¥{(min / 10000).toFixed(0)}万 〜 ¥{(max / 10000).toFixed(0)}万
        </p>
        <p className="mt-0.5 text-xs text-secondary">
          ※ モック値。スキルスタック・地域・案件条件により大きく変動します
        </p>
      </div>
    </div>
  );
}
