/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep verification builds separate from an active development server.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
};

export default nextConfig;
