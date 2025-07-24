import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Development sırasında cross-origin erişime izin ver
  allowedDevOrigins: ['192.168.80.1', 'localhost', '127.0.0.1'],
  
  async headers() {
    return [
      {
        // API route'ları için CORS headers
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Tüm domain'lerden erişime izin ver
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
      {
        // /query route'u için özel CORS (app router için)
        source: '/query',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Tüm domain'lerden erişime izin ver
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
