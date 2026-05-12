/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'silvioh22.sg-host.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'silvioh22.sg-host.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
