# argolizm — 市場価値算定アルゴリズム

## Overview
TalentFlow サポートツール。エンジニア・デザイナー等クリエイティブ職の市場価値を算定するアルゴリズム「argolizm」のプロトタイプ。OSS公開を前提とした設計。

## Tech Stack
- **Framework**: Next.js 16 (App Router, TypeScript, Turbopack)
- **Styling**: Tailwind CSS v4 + PostCSS
- **PDF解析**: pdfjs-dist v4 (クライアントサイド)
- **外部API**: GitHub REST API (認証不要)
- **Font**: Noto Sans JP
- **Path Alias**: `@/*` → `./src/*`

## Project Structure
```
src/
├── app/
│   ├── layout.tsx       # Noto Sans JP、メタデータ
│   ├── page.tsx         # メインページ（入力フォーム + 結果表示）
│   └── globals.css      # CSS変数（TalentFlowと共通）
├── components/
│   ├── ui/              # Button, Card, Badge, Spinner
│   ├── ResumeUploader.tsx   # PDF drag&drop + テキスト抽出
│   ├── GitHubSection.tsx    # GitHub ユーザー名入力 + プロフィール取得
│   ├── PortfolioSection.tsx # URL複数入力
│   └── ScoreResult.tsx      # スコア表示（モック）
└── lib/
    └── scorer.ts        # スコア計算ロジック（OSSの核になる予定）
```

## Commands
```bash
npm run dev    # 開発サーバー起動 (port 3003)
npm run build  # 本番ビルド
```

## Key Notes
- pdfjs-dist の Worker は CDN URL を使用（クライアントコンポーネント内で dynamic import）
- スコアはすべてフロントエンドで計算（Firebase不要）
- `src/lib/scorer.ts` が将来OSSとして公開される核のファイル
