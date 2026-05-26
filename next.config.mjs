import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const githubRepositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "Site_about_mountains";
const basePath = isGithubActions ? `/${githubRepositoryName}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  outputFileTracingRoot: projectRoot,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
