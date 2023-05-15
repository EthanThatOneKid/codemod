import type {
  GitHubAPIClientInterface,
  ReposOwnerRepoPullsPostResponse,
} from "./api/mod.ts";
// Or ./branch/mod.ts?
import type { GitHubBranchResult } from "./create_branch.ts";
import { createOrUpdateBranch } from "./create_branch.ts";

export interface GitHubPRResult extends GitHubBranchResult {
  pr: ReposOwnerRepoPullsPostResponse;
}

export async function createPR(
  api: GitHubAPIClientInterface,
  prOptions: GitHubPROptions,
  branchOptions: GitHubBranchOptions,
  commitOptions: GitHubCommitOptions,
  treeOptions: GitHubTreeOptions,
): Promise<GitHubPRResult> {
  const createOrUpdateBranchResult = await createOrUpdateBranch(
    api,
    branchOptions,
    commitOptions,
    treeOptions,
  );
  const pr = await api.postReposOwnerRepoPulls(prOptions);
  return { ...createOrUpdateBranchResult, pr };
}
