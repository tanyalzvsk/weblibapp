/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "depravo.pythonanywhere.com",
      },
    ],
  },
};

module.exports = nextConfig;
