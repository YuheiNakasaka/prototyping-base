# プロトタイプ開発ルール

このファイルは、LLMを活用した迅速なプロトタイプ開発をサポートするためのルールと指針を定義します。

## 基本方針

### 開発優先度
1. **迅速性**: 完璧より動作するプロトタイプを優先
2. **シンプルさ**: 複雑なアーキテクチャは避ける
3. **実用性**: デモに必要な機能に集中

### 技術スタック
- **言語**: TypeScript
- **フロントエンド**: React 19+、TailwindCSS
- **フレームワーク**: Next.js 15+ (Pages Routerのみ)
- **バックエンド**: Node.js
- **DB**: Cloudflare D1（必要に応じて）
- **デプロイ**: Cloudflare Workers/Pages
- **Code Quality**: Biome (lint/format)、Husky (pre-commit)

## コーディングルール

### 必須事項
- **日本語**: ドキュメント、コメントは日本語を使用
- **型安全性**: TypeScriptを活用し、any型は避ける
- **最新バージョン**: 常に最新の安定版を使用
- **セキュリティ**: パブリック公開を前提とし、秘匿情報を含まない

### コード生成時の指針
```typescript
// ✅ 良い例：日本語コメントと英語の変数名・関数名
interface UserInfo {
  name: string;
  email: string;
  createdAt: Date;
}

// ユーザー情報を取得する関数
export const getUserInfo = async (id: string): Promise<UserInfo> => {
  // 実装...
}
```

### ファイル構成
```
/
├── pages/           # Next.js Pages Router
├── components/      # 再利用可能なコンポーネント
├── lib/            # ユーティリティ関数
├── styles/         # CSS/TailwindCSS
├── types/          # 型定義
└── public/         # 静的ファイル
```

## データベース指針

### 優先順位
1. **不要**: 静的データはJSON/ハードコーディング
2. **軽量**: ローカルStorage、SessionStorage
3. **本格的**: Cloudflare D1（ORMは使わない、生SQLで実装）

### D1使用時のパターン
```typescript
// データベース接続とクエリ実行
export const executeQuery = async (sql: string, params: any[] = []) => {
  const result = await env.DB.prepare(sql).bind(...params).all();
  return result;
};
```

## UI/UX指針

### デザイン原則
- **AIファースト**: ChatGPTやClaude、v0.devなどでUI生成
- **コンポーネント化**: 再利用可能な小さなコンポーネント
- **レスポンシブ**: モバイルファーストのデザイン
- **アクセシビリティ**: 基本的なWCAGガイドライン準拠

### TailwindCSS使用例
```jsx
// モダンで使いやすいUIコンポーネント
export const Button = ({ children, onClick, variant = "primary" }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

## デプロイとCloudflare活用

### 利用サービス
- **Workers/Pages**: アプリケーションホスティング
- **D1**: SQLite互換データベース
- **R2**: 静的ファイルストレージ
- **KV**: キャッシュ・設定値保存
- **Queues**: 非同期タスク処理

### 環境変数管理
```bash
# .env.example
NEXT_PUBLIC_APP_NAME=プロトタイプアプリ
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

## 開発ワークフロー

### 1. 要件定義フェーズ
```markdown
## アプリ概要
- **目的**: [ここに目的を記載]
- **対象ユーザー**: [ターゲットユーザー]
- **主要機能**: [核となる機能3つまで]
```

### 2. UI生成フェーズ
- v0.devやClaude Artifactsでワイヤーフレーム生成
- TailwindCSSでスタイリング
- コンポーネント分割

### 3. 機能実装フェーズ
- Pages Routerでルーティング設定
- API routesで必要なエンドポイント作成
- 状態管理（useState、useContext）

### 4. デプロイフェーズ
```bash
# Cloudflareでのデプロイ
npm run build
npm run deploy
```

## トラブルシューティング

### よくある問題と解決法
1. **型エラー**: `npm run type-check`で確認
2. **スタイル未適用**: TailwindCSSの設定確認
3. **デプロイエラー**: wrangler.tomlの設定確認

### デバッグ用コマンド
```bash
npm run dev        # 開発サーバー起動
npm run build      # ビルド実行
npm run lint       # Biomeでコード品質チェック
npm run lint:fix   # Biomeで自動修正
npm run format     # Biomeでコードフォーマット
npm run type-check # 型チェック実行
npm run preview    # Cloudflareでローカルプレビュー
npm run deploy     # Cloudflareにデプロイ
```

## AI活用のコツ

### プロンプト例
```
「Next.js 15のPages Routerを使用して、[機能名]を実装してください。
- TypeScriptを使用
- TailwindCSSでスタイリング
- 日本語でコメント記述
- レスポンシブデザイン対応
- Biomeでコード品質チェック」
```

### コード生成後のチェックポイント
- [ ] 型安全性が保たれているか
- [ ] 日本語コメントが適切に記述されているか
- [ ] TailwindCSSクラスが正しく適用されているか
- [ ] エラーハンドリングが実装されているか
- [ ] Biomeでlint/formatが通るか
- [ ] `npm run type-check`でエラーがないか
