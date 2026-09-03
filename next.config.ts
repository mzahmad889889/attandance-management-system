import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // The API client calls collection endpoints with a trailing slash (/api/workers/).
  // Without this Next answers with a 308 before the proxy route ever runs.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
