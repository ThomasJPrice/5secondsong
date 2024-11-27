/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co'
      },
      {
        protocol: 'https',
        hostname: 'cdn-images.dzcdn.net'
      },
      {
        protocol: 'https',
        hostname: 'api.deezer.com'
      }
    ]
  }
};

export default nextConfig;
