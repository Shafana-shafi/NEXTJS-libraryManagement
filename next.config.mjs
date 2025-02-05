import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // Add via.placeholder.com to remotePatterns
      },
    ],
    domains: ['lh3.googleusercontent.com'],
  },
};

export default withNextIntl(nextConfig);
