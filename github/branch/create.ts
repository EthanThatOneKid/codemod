import type { GitHubAPIClientInterface } from "../api/mod.ts";
import { createCommit } from "../commit/mod.ts";
import type { GitHubBranchResult, GitHubCreateBranchOptions } from "./types.ts";

/**
 * createBranch creates a branch on GitHub.
 */
export async function createBranch(
  api: GitHubAPIClientInterface,
  options: GitHubCreateBranchOptions,
): Promise<GitHubBranchResult> {
  const commitResult = await createCommit(api, options);
  const response = await api.postRefs({
    ref: `refs/heads/${options.newBranchName}`,
    sha: commitResult.commit.sha,
  });
  return { ...commitResult, branch: response };
}
