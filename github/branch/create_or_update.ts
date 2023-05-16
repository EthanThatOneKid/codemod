import type { GitHubAPIClientInterface } from "../api/mod.ts";
import type {
  GitHubBranchResult,
  GitHubCreateOrUpdateBranchOptions,
} from "./types.ts";
import { createBranch } from "./create.ts";
import { updateBranch } from "./update.ts";

/**
 * createOrUpdateBranch creates or updates a branch on GitHub.
 */
export async function createOrUpdateBranch(
  api: GitHubAPIClientInterface,
  options: GitHubCreateOrUpdateBranchOptions,
): Promise<GitHubBranchResult> {
  const headBranch = await api.getReposOwnerRepoBranchesBranch({
    branch: options.headBranchName,
  }).catch(() => null);
  if (!headBranch) {
    return createBranch(api, options);
  }

  return updateBranch(api, options);
}
