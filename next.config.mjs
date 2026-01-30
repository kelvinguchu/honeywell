import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'honeywell-silk.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/f/**',
      },
      {
        protocol: 'https',
        hostname: 'ufs.sh',
        pathname: '/f/**',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        pathname: '/f/**',
      },
    ],
  },
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
