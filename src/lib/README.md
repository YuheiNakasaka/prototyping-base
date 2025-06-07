# Lib

このディレクトリにはユーティリティ関数、共通ロジック、ヘルパー関数を配置します。

## ユーティリティ関数の例

### 日付操作

```typescript
// src/lib/date.ts

/**
 * 日付を日本語形式でフォーマットする
 */
export const formatDateJP = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(date);
};

/**
 * 相対時間を日本語で表示する
 */
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今日';
  if (diffDays === 1) return '昨日';
  if (diffDays < 7) return `${diffDays}日前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前`;
  return `${Math.floor(diffDays / 365)}年前`;
};
```

### 文字列操作

```typescript
// src/lib/string.ts

/**
 * 文字列を指定した長さで切り詰める
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * 文字列をケバブケースに変換
 */
export const toKebabCase = (str: string): string => {
  return str
    .replace(/\s+/g, '-')
    .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
    .replace(/^-/, '')
    .toLowerCase();
};

/**
 * メールアドレスの形式をチェック
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

### API通信

```typescript
// src/lib/api.ts

/**
 * APIレスポンスの型定義
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

/**
 * 基本的なAPIクライアント
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * GETリクエスト
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      data,
      status: response.status
    };
  }

  /**
   * POSTリクエスト
   */
  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      data,
      status: response.status
    };
  }
}

// デフォルトクライアントをエクスポート
export const apiClient = new ApiClient();
```

### ローカルストレージ操作

```typescript
// src/lib/storage.ts

/**
 * 型安全なローカルストレージ操作
 */
export class LocalStorage {
  /**
   * データを保存
   */
  static set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * データを取得
   */
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return null;
    }
  }

  /**
   * データを削除
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  /**
   * すべてのデータをクリア
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}
```

### バリデーション

```typescript
// src/lib/validation.ts

/**
 * バリデーションルールの型定義
 */
export type ValidationRule<T> = (value: T) => string | null;

/**
 * 共通バリデーションルール
 */
export const validationRules = {
  required: <T>(value: T): string | null => {
    if (value === null || value === undefined || value === '') {
      return 'この項目は必須です';
    }
    return null;
  },

  minLength: (min: number) => (value: string): string | null => {
    if (value.length < min) {
      return `${min}文字以上で入力してください`;
    }
    return null;
  },

  maxLength: (max: number) => (value: string): string | null => {
    if (value.length > max) {
      return `${max}文字以下で入力してください`;
    }
    return null;
  },

  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return '有効なメールアドレスを入力してください';
    }
    return null;
  },
};

/**
 * フォームデータのバリデーション
 */
export const validateForm = <T extends Record<string, any>>(
  data: T,
  rules: Partial<Record<keyof T, ValidationRule<T[keyof T]>[]>>
): Record<keyof T, string | null> => {
  const errors = {} as Record<keyof T, string | null>;

  for (const field in rules) {
    const fieldRules = rules[field] || [];
    const value = data[field];

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // 最初のエラーで停止
      }
    }

    if (!errors[field]) {
      errors[field] = null;
    }
  }

  return errors;
};
```

## 使用例

```typescript
// pages/example.tsx での使用例
import { formatDateJP, getRelativeTime } from '@/lib/date';
import { truncate, isValidEmail } from '@/lib/string';
import { apiClient } from '@/lib/api';
import { LocalStorage } from '@/lib/storage';
import { validateForm, validationRules } from '@/lib/validation';

export default function ExamplePage() {
  // 日付操作の使用例
  const now = new Date();
  const formattedDate = formatDateJP(now);
  const relativeTime = getRelativeTime(new Date(Date.now() - 86400000)); // 1日前

  // バリデーションの使用例
  const formData = { email: 'test@example.com', name: 'テスト' };
  const errors = validateForm(formData, {
    email: [validationRules.required, validationRules.email],
    name: [validationRules.required, validationRules.minLength(2)]
  });

  return (
    <div>
      <p>今日の日付: {formattedDate}</p>
      <p>相対時間: {relativeTime}</p>
    </div>
  );
}
```

## ベストプラクティス

1. **純粋関数**: 副作用のない純粋関数として実装する
2. **型安全性**: TypeScriptの型を活用してランタイムエラーを防ぐ
3. **エラーハンドリング**: 適切なエラーハンドリングを実装する
4. **テスタビリティ**: 単体テストが書きやすい構造にする
5. **再利用性**: プロジェクト全体で使い回せるよう汎用的に設計する
6. **日本語対応**: 日本語圏のユーザーに配慮した実装にする