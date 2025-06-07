# プロトタイプ開発環境

このリポジトリは、迅速なプロトタイプ開発をサポートする環境です。LLMを活用して効率的にNext.jsアプリケーションを構築し、Cloudflareにデプロイできます。

## 📋 技術スタック

- **フレームワーク**: Next.js 14+ (Pages Router)
- **言語**: TypeScript
- **UI**: React 19+、TailwindCSS
- **リンター/フォーマッター**: Biome
- **デプロイ**: Cloudflare Pages (OpenNext使用)

## 🚀 クイックスタート

### 1. プロジェクト作成
```bash
# このテンプレートを使用
git clone <このリポジトリ>
cd prototyping-base
npm install
```

### 2. 環境変数設定
```bash
cp .env.example .env.local
# .env.localを編集して必要な値を設定
```

### 3. 開発サーバー起動
```bash
npm run dev
```

### 4. コード品質チェック
```bash
npm run lint        # コードの品質チェック
npm run format      # コードの自動フォーマット
npm run type-check  # TypeScript型チェック
```

## 📁 ディレクトリ構成

```
/
├── pages/           # Next.js Pages Router
│   ├── api/         # API Routes
│   ├── _app.tsx     # アプリ全体の設定
│   └── index.tsx    # ホームページ
├── components/      # 再利用可能なUIコンポーネント
├── lib/            # ユーティリティ関数・共通ロジック
├── styles/         # グローバルCSS・TailwindCSS
├── types/          # TypeScript型定義
├── public/         # 静的ファイル
└── CLAUDE.md       # LLM開発ルール
```

## 🎯 開発ワークフロー

### Phase 1: 要件整理
1. アプリの目的と主要機能（3つまで）を明確化
2. ターゲットユーザーの特定
3. 必要なデータの種類の検討

### Phase 2: UI設計・実装
1. ワイヤーフレーム作成（v0.dev、Claude Artifacts推奨）
2. コンポーネント分割・実装
3. TailwindCSSでスタイリング
4. レスポンシブ対応

### Phase 3: 機能実装
1. Pages Routerでルーティング設定
2. 必要に応じてAPI Routes作成
3. 状態管理（useState、useContext）
4. データ取得・表示ロジック実装

### Phase 4: デプロイ
1. ビルド・テスト実行
2. Cloudflareへデプロイ

## ☁️ Cloudflareデプロイ

### 前提条件
- Cloudflareアカウント
- Wrangler CLI設定済み

### デプロイ手順

#### 初回セットアップ
```bash
# Wranglerでログイン
npx wrangler login

# Cloudflare Pagesプロジェクト作成
npx wrangler pages project create my-app
```

#### デプロイ実行
```bash
# ビルド＆デプロイ
npm run deploy

# またはステップごとに実行
npm run pages:build  # OpenNextでビルド
npm run preview      # ローカルでプレビュー
npx wrangler pages deploy  # 本番デプロイ
```

### 環境変数設定（Cloudflare）
```bash
# Cloudflareダッシュボードまたはwranglerで設定
npx wrangler pages secret put NEXT_PUBLIC_APP_NAME
npx wrangler pages secret put DATABASE_URL
```

## 🗄️ データベース選択指針

### 1. 静的データ
```typescript
// JSON埋め込み（最もシンプル）
const SAMPLE_DATA = [
  { id: 1, name: "サンプル1" },
  { id: 2, name: "サンプル2" },
];
```

### 2. 軽量な動的データ
```typescript
// LocalStorage / SessionStorage
localStorage.setItem('userData', JSON.stringify(data));
```

### 3. 本格的なデータベース
```typescript
// Cloudflare D1（SQLite互換）
export const executeQuery = async (sql: string, params: any[] = []) => {
  const result = await env.DB.prepare(sql).bind(...params).all();
  return result;
};
```

#### D1セットアップ
```bash
# D1データベース作成
npx wrangler d1 create my-database

# スキーマ適用
npx wrangler d1 execute my-database --file=./schema.sql

# ローカル開発用
npx wrangler d1 execute my-database --local --file=./schema.sql
```

## 🎨 UIコンポーネント例

### 基本ボタン
```tsx
export const Button = ({ children, onClick, variant = "primary" }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### カード型レイアウト
```tsx
export const Card = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
    {children}
  </div>
);
```

## 🤖 LLM活用のコツ

### 効果的なプロンプト例
```
「Next.js 14のPages Routerを使用して、以下の機能を実装してください：
- [具体的な機能の説明]
- TypeScriptで型安全に実装
- TailwindCSSでモダンなスタイリング
- レスポンシブデザイン対応
- 日本語でコメント記述」
```

### コード生成後のチェックリスト
- [ ] TypeScript型定義は適切か
- [ ] エラーハンドリングは実装されているか
- [ ] TailwindCSSクラスは正しく適用されているか
- [ ] 日本語コメントが記述されているか
- [ ] セキュリティの問題はないか

## 🔧 トラブルシューティング

### よくある問題

#### 型エラーが発生する
```bash
npm run type-check  # 詳細な型エラーを確認
```

#### TailwindCSSが適用されない
1. `tailwind.config.js`のcontent設定を確認
2. CSSファイルでTailwindディレクティブを確認

#### デプロイエラー
1. ビルドが成功するか確認: `npm run build`
2. 環境変数の設定を確認
3. OpenNextの設定を確認

#### ローカル開発でエラー
```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install

# キャッシュクリア
rm -rf .next
npm run dev
```

## 📚 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [OpenNext Documentation](https://opennext.js.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Biome Documentation](https://biomejs.dev/)

## 🤝 貢献

このテンプレートの改善提案やバグ報告はIssuesまでお願いします。