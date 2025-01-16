import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
  images: {
    loader: "default", // or you can use 'imgix', 'cloudinary', etc.
    domains: ["utfs.io"], // Add domains from where images can be loaded
  },
};

export default nextConfig;
