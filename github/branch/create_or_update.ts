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
  const newBranch = await api.getBranch({
    branch: `refs/heads/${options.newBranchName}`,
  }).catch(() => null);
  if (!newBranch) {
    return createBranch(api, options);
  }

  // If the branch already exists, we need to update
  // the new branch, not create a new one based on
  // the base branch.
  return updateBranch(api, {
    ...options,
    baseBranchName: options.newBranchName,
  });
}
