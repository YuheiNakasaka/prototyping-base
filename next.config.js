/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript設定
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // 画像最適化（Cloudflareでは無効化）
  images: {
    unoptimized: true,
  },
  
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;