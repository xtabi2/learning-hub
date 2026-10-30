import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // libSQL ships native bindings + non-JS files; keep them out of the webpack bundle.
  serverExternalPackages: ["@prisma/client", "bcryptjs", "@prisma/adapter-libsql", "@libsql/client", "libsql"],
};

export default nextConfig;
