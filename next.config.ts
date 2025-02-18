import type { NextConfig } from "next";

//const isProduction = process.env.BUILD_ENV === "PROD";

const nextConfig: NextConfig = {
  /* config options here */
  /* when developing, use export for npm run dev. Otherwise standalone for deploying to the web*/
  //output: isProduction ? "standalone" : "export",
  output: "standalone",
  trailingSlash: true,
  images: {
    unoptimized: true,
  }
};

export default nextConfig;

