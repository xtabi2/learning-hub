import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Repo root, so the shared profile and the workspace lockfile trace correctly.
  outputFileTracingRoot: path.join(__dirname, "../.."),
  // Hub serves this app at /adventure. Public files live at public/<file>
  // so existing /adventure/... art URLs stay the same once basePath is applied.
  basePath: "/adventure",
  // libSQL ships native bindings + non-JS files; keep them out of the webpack bundle.
  serverExternalPackages: ["@prisma/client", "bcryptjs", "@prisma/adapter-libsql", "@libsql/client", "libsql"],
};

export default nextConfig;
