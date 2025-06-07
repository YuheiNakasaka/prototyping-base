# GitHub Actions設定

## 必要なSecrets

GitHubリポジトリの設定で以下のSecretsを追加してください：

### Settings > Secrets and variables > Actions > New repository secret

1. **CLOUDFLARE_API_TOKEN**
   - Cloudflareダッシュボードで生成したAPIトークン
   - 必要な権限: `Cloudflare Workers:Edit`, `Account:Read`, `Zone:Read`

2. **CLOUDFLARE_ACCOUNT_ID**
   - CloudflareのAccount ID
   - ダッシュボードのサイドバーで確認可能

## ワークフロー概要

### `.github/workflows/deploy.yml`

- **トリガー**: main ブランチへのpush、PRの作成・更新
- **実行内容**:
  1. 依存関係のインストール
  2. Cloudflare型定義の生成 (`cf-typegen`)
  3. 型チェック
  4. Lint実行
  5. ビルド
  6. デプロイ
     - PR: プレビューデプロイ (`npm run preview`)
     - main: 本番デプロイ (`npm run deploy`)

## セットアップ手順

1. CloudflareでAPIトークンを生成
2. GitHubリポジトリにSecretsを追加
3. main ブランチにpushまたはPRを作成してワークフローをテスト