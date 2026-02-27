"use client";

type PortfolioSectionProps = {
  urls: string[];
  onChange: (urls: string[]) => void;
};

const MAX_URLS = 5;

export function PortfolioSection({ urls, onChange }: PortfolioSectionProps) {
  const handleChange = (index: number, value: string) => {
    const next = [...urls];
    next[index] = value;
    onChange(next);
  };

  const handleAdd = () => {
    if (urls.length < MAX_URLS) {
      onChange([...urls, ""]);
    }
  };

  const handleRemove = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {urls.map((url, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder="https://your-portfolio.com"
            className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={() => handleRemove(index)}
            className="shrink-0 rounded-lg p-1.5 text-secondary hover:bg-danger-light hover:text-danger transition-colors"
            aria-label="削除"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}

      {urls.length < MAX_URLS && (
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          URLを追加 ({urls.length}/{MAX_URLS})
        </button>
      )}

      {urls.length === 0 && (
        <p className="text-sm text-secondary">
          ポートフォリオサイト、作品ページ、Zenn/Qiita等のURLを入力してください。
        </p>
      )}
    </div>
  );
}
