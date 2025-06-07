# Components

このディレクトリには再利用可能なUIコンポーネントを配置します。

## 基本的なコンポーネントの書き方

### Button コンポーネント

```tsx
// src/components/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false 
}: ButtonProps) => {
  const baseClasses = "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

### Card コンポーネント

```tsx
// src/components/Card.tsx
interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Card = ({ children, title, className = '' }: CardProps) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
    {title && (
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);
```

### Modal コンポーネント

```tsx
// src/components/Modal.tsx
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* モーダルコンテンツ */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
```

## 使用例

```tsx
// pages/index.tsx での使用例
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { useState } from 'react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="p-8">
      <Card title="サンプルカード">
        <p className="mb-4">ここにコンテンツが入ります。</p>
        <Button onClick={() => setIsModalOpen(true)}>
          モーダルを開く
        </Button>
      </Card>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="サンプルモーダル"
      >
        <p>モーダルの内容です。</p>
        <Button onClick={() => setIsModalOpen(false)}>
          閉じる
        </Button>
      </Modal>
    </div>
  );
}
```

## コンポーネント作成のベストプラクティス

1. **TypeScript を活用**: propsの型定義を明確にする
2. **デフォルト値の設定**: propsにはデフォルト値を設定する
3. **TailwindCSS の活用**: スタイリングはTailwindCSSを使用
4. **アクセシビリティ**: ARIA属性やキーボード操作に配慮
5. **再利用性**: 汎用的に使えるよう設計する
6. **日本語コメント**: 複雑なロジックには日本語でコメントを記述