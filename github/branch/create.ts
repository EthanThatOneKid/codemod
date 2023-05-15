import type { GitHubAPIClientInterface } from "../api/mod.ts";
import type { GitHubCreateCommitOptions } from "../commit/mod.ts";
import type { GitHubBranchResult, GitHubCreateBranchOptions } from "./types.ts";

/**
 * createBranch creates a branch on GitHub.
 */
export async function createBranch(
  api: GitHubAPIClientInterface,
  createBranchOptions: GitHubCreateBranchOptions,
  commitOptions: GitHubCreateCommitOptions,
  treeOptions: GitHubCreateTreeOptions,
): Promise<GitHubBranchResult> {
}
