# プロトタイプ開発環境

このリポジトリは、迅速なプロトタイプ開発をサポートする環境です。LLMを活用して効率的にNext.jsアプリケーションを構築し、GitHub ActionsでCloudflareに自動デプロイできます。

## 📋 技術スタック

- **フレームワーク**: Next.js 15+ (Pages Router)
- **言語**: TypeScript
- **UI**: React 19+、TailwindCSS
- **リンター/フォーマッター**: Biome
- **Git フック**: Husky (pre-commit)
- **CI/CD**: GitHub Actions
- **デプロイ**: Cloudflare Pages (OpenNext使用)

## 🚀 クイックスタート

### 1. リポジトリのセットアップ
```bash
git clone <このリポジトリ>
cd prototyping-base
npm install
```

### 2. 開発サーバー起動
```bash
npm run dev
```

### 3. 利用可能なコマンド
```bash
npm run dev         # 開発サーバー起動
npm run build       # 本番ビルド
npm run lint        # コードの品質チェック
npm run format      # コードの自動フォーマット
npm run type-check  # TypeScript型チェック
npm run cf-typegen  # Cloudflare型定義生成
```

## 📁 ディレクトリ構成

```
/
├── src/
│   ├── pages/       # Next.js Pages Router
│   │   ├── api/     # API Routes
│   │   ├── _app.tsx # アプリ全体の設定
│   │   └── index.tsx # ホームページ
│   ├── components/  # 再利用可能なUIコンポーネント
│   ├── lib/        # ユーティリティ関数・共通ロジック
│   ├── styles/     # グローバルCSS・TailwindCSS
│   └── types/      # TypeScript型定義
├── public/         # 静的ファイル
└── CLAUDE.md       # LLM開発ルール
```

## 🔄 自動化された開発ワークフロー

### Git フック（Husky）
コミット前に以下が自動実行されます：
- **cf-typegen**: Cloudflare型定義の生成
- **format**: コードの自動フォーマット
- **lint**: コード品質チェック

### GitHub Actions CI/CD
プッシュ/PR作成時に以下が自動実行されます：

#### Pull Request
- 依存関係インストール
- 型定義生成、型チェック、Lint
- ビルド
- **プレビューデプロイ** (Cloudflare Pages)

#### main ブランチ
- 上記に加えて
- **本番デプロイ** (Cloudflare Pages)

## 🎯 開発ワークフロー

### Phase 1: 要件整理
1. アプリの目的と主要機能（3つまで）を明確化
2. ターゲットユーザーの特定
3. 必要なデータの種類の検討

### Phase 2: 開発環境セットアップ
1. リポジトリをフォーク/クローン
2. Cloudflare Secretsを設定（デプロイ用）
3. ローカル開発開始

### Phase 3: UI設計・実装
1. ワイヤーフレーム作成（v0.dev、Claude Artifacts推奨）
2. コンポーネント分割・実装
3. TailwindCSSでスタイリング
4. レスポンシブ対応

### Phase 4: 機能実装
1. Pages Routerでルーティング設定
2. 必要に応じてAPI Routes作成
3. 状態管理（useState、useContext）
4. データ取得・表示ロジック実装

### Phase 5: デプロイ
1. PRを作成してプレビューデプロイを確認
2. mainブランチにマージして本番デプロイ

## ☁️ Cloudflareデプロイ設定

### 初回セットアップ
1. **GitHub Secrets設定**（リポジトリ設定で追加）
   - `CLOUDFLARE_API_TOKEN`: CloudflareのAPIトークン
   - `CLOUDFLARE_ACCOUNT_ID`: CloudflareのAccount ID

2. **APIトークンの生成**
   - Cloudflareダッシュボード > My Profile > API Tokens
   - 必要な権限: `Cloudflare Workers:Edit`, `Account:Read`, `Zone:Read`

3. **自動デプロイ**
   - PRを作成 → プレビューデプロイ
   - mainにマージ → 本番デプロイ

### 手動デプロイ（必要時）
```bash
npm run preview  # プレビューデプロイ
npm run deploy   # 本番デプロイ（Wrangler設定済みの場合）
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
npm run cf-typegen  # Cloudflare型定義を再生成
```

#### TailwindCSSが適用されない
1. `tailwind.config.js`のcontent設定を確認
2. CSSファイルでTailwindディレクティブを確認

#### GitHub Actionsでデプロイが失敗する
1. Repository SecretsでCloudflare認証情報を確認
2. GitHub Actionsのログでエラー詳細を確認
3. ローカルでビルドが成功するか確認: `npm run build`

#### pre-commitフックでエラーが発生する
```bash
# Huskyが正しくインストールされているか確認
npx husky --version

# フックを手動実行してテスト
npm run cf-typegen
npm run format
npm run lint
```

#### ローカル開発でエラー
```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install

# キャッシュクリア
rm -rf .next
npm run dev

# Huskyフックを再インストール
npx husky install
```

#### Cloudflare型定義エラー
```bash
# wrangler.tomlが存在することを確認
# APIトークンが正しく設定されていることを確認
npm run cf-typegen
```

## 📚 参考リンク

### フレームワーク・ライブラリ
- [Next.js Documentation](https://nextjs.org/docs) - Pages Router
- [React 19 Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### 開発ツール
- [Biome Documentation](https://biomejs.dev/) - Lint & Format
- [Husky Documentation](https://typicode.github.io/husky/) - Git Hooks
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

### デプロイ・インフラ
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [OpenNext Documentation](https://opennext.js.org/) - Next.js on Cloudflare
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

## 🤝 貢献

このテンプレートの改善提案やバグ報告はIssuesまでお願いします。