import type { GitHubAPIClientInterface } from "../api/mod.ts";
import { createCommit } from "../commit/mod.ts";
import type { GitHubBranchResult, GitHubUpdateBranchOptions } from "./types.ts";

/**
 * updateBranch updates a branch on GitHub.
 */
export async function updateBranch(
  api: GitHubAPIClientInterface,
  options: GitHubUpdateBranchOptions,
): Promise<GitHubBranchResult> {
  const commitResult = await createCommit(api, options);
  const response = await api.patchRef({
    ref: `heads/${options.baseBranchName}`,
    sha: commitResult.commit.sha,
    force: options.force,
  });
  return { ...commitResult, branch: response };
}
