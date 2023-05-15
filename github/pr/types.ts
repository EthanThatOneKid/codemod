import type { ReposOwnerRepoPullsPostResponse } from "../api/mod.ts";
import type { GitHubBranchResult } from "../branch/mod.ts";

/**
 * GitHubPRResult is the result of creating a PR.
 */
export interface GitHubPRResult extends GitHubBranchResult {
  pr: ReposOwnerRepoPullsPostResponse;
}
