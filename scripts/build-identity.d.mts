export interface BuildIdentity {
  product: string;
  release: string;
  commit: string;
  builtAt: string;
}

export const DEVELOPMENT_RELEASE: "0.0.0-dev";

export function createBuildIdentity(options?: {
  cwd?: string;
  product?: string;
  release?: string;
}): BuildIdentity;
