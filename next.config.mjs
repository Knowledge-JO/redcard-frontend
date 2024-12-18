/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oghibjysbqokcedkbicl.supabase.co",
      },
    ],
  },
};

export default nextConfig;
