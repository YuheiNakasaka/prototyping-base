# Types

このディレクトリにはTypeScriptの型定義を配置します。

## 基本的な型定義の例

### ユーザー関連の型

```typescript
// src/types/user.ts

/**
 * ユーザーの基本情報
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ユーザー作成時の入力データ
 */
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

/**
 * ユーザー更新時の入力データ
 */
export interface UpdateUserInput {
  name?: string;
  email?: string;
  avatar?: string;
}

/**
 * ユーザーのロール
 */
export type UserRole = 'admin' | 'user' | 'guest';

/**
 * ログイン状態
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
```

### API関連の型

```typescript
// src/types/api.ts

/**
 * APIレスポンスの基本形
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  success: boolean;
}

/**
 * APIエラーレスポンス
 */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, any>;
}

/**
 * ページネーション情報
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * ページネーション付きAPIレスポンス
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

/**
 * APIリクエストの状態
 */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * 非同期処理の状態管理
 */
export interface AsyncState<T> {
  data: T | null;
  status: RequestStatus;
  error: string | null;
}
```

### フォーム関連の型

```typescript
// src/types/form.ts

/**
 * フォームフィールドの状態
 */
export interface FormField<T> {
  value: T;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

/**
 * フォーム全体の状態
 */
export interface FormState<T extends Record<string, any>> {
  fields: {
    [K in keyof T]: FormField<T[K]>;
  };
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

/**
 * バリデーションルール
 */
export type ValidationRule<T> = (value: T) => string | null;

/**
 * フォームの設定
 */
export interface FormConfig<T extends Record<string, any>> {
  initialValues: T;
  validationRules?: Partial<{
    [K in keyof T]: ValidationRule<T[K]>[];
  }>;
  onSubmit: (values: T) => void | Promise<void>;
}

/**
 * 入力コンポーネントの共通props
 */
export interface InputProps {
  id?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string | null;
  onChange: (value: any) => void;
  onBlur?: () => void;
}
```

### 一般的な型

```typescript
// src/types/common.ts

/**
 * ID型（文字列または数値）
 */
export type ID = string | number;

/**
 * 選択肢の型
 */
export interface Option<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

/**
 * 座標情報
 */
export interface Coordinates {
  x: number;
  y: number;
}

/**
 * サイズ情報
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * 色の型
 */
export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

/**
 * サイズの型
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * 方向の型
 */
export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * テーマの型
 */
export type Theme = 'light' | 'dark';

/**
 * 言語の型
 */
export type Language = 'ja' | 'en';

/**
 * 環境変数の型
 */
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_APP_NAME: string;
  NEXT_PUBLIC_APP_VERSION: string;
  DATABASE_URL?: string;
  API_KEY?: string;
}
```

### データベース関連の型

```typescript
// src/types/database.ts

/**
 * データベースレコードの基本形
 */
export interface BaseRecord {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

/**
 * ソート条件
 */
export interface SortCondition {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * フィルター条件
 */
export interface FilterCondition {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'like' | 'in' | 'not in';
  value: any;
}

/**
 * クエリパラメータ
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: SortCondition[];
  filter?: FilterCondition[];
  search?: string;
}

/**
 * Cloudflare D1のクエリ結果
 */
export interface D1Result<T = any> {
  results: T[];
  success: boolean;
  meta: {
    changed_db: boolean;
    changes: number;
    duration: number;
    last_row_id: number;
    rows_read: number;
    rows_written: number;
  };
}
```

### コンポーネント関連の型

```typescript
// src/types/components.ts

/**
 * 基本的なReactコンポーネントのprops
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

/**
 * クリック可能な要素のprops
 */
export interface ClickableProps {
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
}

/**
 * モーダルコンポーネントのprops
 */
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ComponentSize;
  closable?: boolean;
}

/**
 * ボタンコンポーネントのprops
 */
export interface ButtonProps extends BaseComponentProps, ClickableProps {
  variant?: Color;
  size?: ComponentSize;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * カードコンポーネントのprops
 */
export interface CardProps extends BaseComponentProps {
  title?: string;
  shadow?: boolean;
  border?: boolean;
  padding?: ComponentSize;
}
```

## 使用例

```typescript
// pages/users.tsx での使用例
import type { User, CreateUserInput, ApiResponse, PaginatedResponse } from '@/types';
import type { FormState } from '@/types/form';
import { useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [formState, setFormState] = useState<FormState<CreateUserInput>>({
    fields: {
      name: { value: '', error: null, touched: false, dirty: false },
      email: { value: '', error: null, touched: false, dirty: false },
      password: { value: '', error: null, touched: false, dirty: false }
    },
    isValid: false,
    isSubmitting: false,
    submitCount: 0
  });

  // APIからユーザー一覧を取得
  const fetchUsers = async (): Promise<PaginatedResponse<User>> => {
    const response = await fetch('/api/users');
    return response.json();
  };

  return (
    <div>
      {/* ユーザー一覧表示 */}
    </div>
  );
}
```

## ベストプラクティス

1. **明確な命名**: 型名は用途が分かりやすい名前にする
2. **適切な粒度**: 型は適切な粒度で分割し、再利用しやすくする
3. **ドキュメント化**: JSDocコメントで型の用途を説明する
4. **Generic活用**: 汎用的な型はGenericを使って柔軟性を持たせる
5. **Union Types**: 限定的な値はUnion Typesで制約する
6. **Optional Properties**: 必須でないプロパティは?マークを付ける
7. **型の拡張**: 既存の型を拡張する場合はextendsやintersectionを活用する

## 型定義ファイルの整理

- `user.ts`: ユーザー関連の型
- `api.ts`: API関連の型
- `form.ts`: フォーム関連の型
- `common.ts`: 汎用的な型
- `database.ts`: データベース関連の型
- `components.ts`: コンポーネント関連の型

ファイルは機能別に分割し、関連する型をまとめて管理することで、保守性と可読性を向上させます。