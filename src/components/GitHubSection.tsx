"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { GitHubProfile } from "@/lib/scorer";

type GitHubSectionProps = {
  onFetch: (profile: GitHubProfile | null) => void;
};

export function GitHubSection({ onFetch }: GitHubSectionProps) {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseUsername = (value: string): string => {
    // Accept both "username" and "github.com/username" formats
    const match = value.match(/github\.com\/([^/?#]+)/);
    return match ? match[1] : value.trim();
  };

  const handleFetch = async () => {
    const name = parseUsername(username);
    if (!name) return;

    setIsFetching(true);
    setError(null);
    setProfile(null);

    try {
      const res = await fetch(`https://api.github.com/users/${name}`);
      if (res.status === 404) {
        setError("ユーザーが見つかりません。ユーザー名を確認してください。");
        onFetch(null);
        return;
      }
      if (!res.ok) {
        setError("GitHub APIの呼び出しに失敗しました。しばらく後に再試行してください。");
        onFetch(null);
        return;
      }
      const data: GitHubProfile = await res.json();
      setProfile(data);
      onFetch(data);
    } catch {
      setError("ネットワークエラーが発生しました。");
      onFetch(null);
    } finally {
      setIsFetching(false);
    }
  };

  const handleClear = () => {
    setProfile(null);
    setUsername("");
    setError(null);
    onFetch(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-primary/30">
          <span className="shrink-0 pl-3 text-sm text-secondary select-none">
            github.com/
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
            placeholder="username"
            className="min-w-0 flex-1 bg-transparent py-2 pr-3 text-sm text-foreground placeholder-secondary/50 focus:outline-none"
          />
        </div>
        <Button
          onClick={handleFetch}
          loading={isFetching}
          disabled={!username.trim()}
          size="md"
        >
          取得
        </Button>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      {profile && (
        <div className="flex items-start gap-4 rounded-lg border border-border bg-muted p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatar_url}
            alt={profile.login}
            className="h-14 w-14 rounded-full border border-border"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">
                  {profile.name || profile.login}
                </p>
                <a
                  href={profile.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  @{profile.login}
                </a>
              </div>
              <button
                onClick={handleClear}
                className="shrink-0 text-secondary hover:text-danger"
                aria-label="クリア"
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
            {profile.bio && (
              <p className="mt-1 line-clamp-2 text-sm text-secondary">
                {profile.bio}
              </p>
            )}
            <div className="mt-2 flex gap-4 text-xs text-secondary">
              <span>
                <strong className="text-foreground">{profile.public_repos}</strong>{" "}
                リポジトリ
              </span>
              <span>
                <strong className="text-foreground">{profile.followers}</strong>{" "}
                フォロワー
              </span>
              <span>
                <strong className="text-foreground">{profile.following}</strong>{" "}
                フォロー中
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
