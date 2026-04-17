import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: '**.togomovie.com' },
    ],
  },
  async rewrites() {
    return [
      // Proxy /api/backend/* → togomovie-backend (avoids CORS in dev)
      {
        source: '/api/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080'}/:path*`,
      },
      // Proxy /api/ai/* → togomovie-ai
      {
        source: '/api/ai/:path*',
        destination: `${process.env.NEXT_PUBLIC_AI_URL ?? 'http://localhost:8081'}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
