import type { GitHubAPIClientInterface } from "../api/mod.ts";
import { createTree } from "../tree/mod.ts";
import type { GitHubCommitResult, GitHubCreateCommitOptions } from "./types.ts";

/**
 * createCommit creates a GitHub commit.
 */
export async function createCommit(
  api: GitHubAPIClientInterface,
  options: GitHubCreateCommitOptions,
): Promise<GitHubCommitResult> {
  const treeResult = await createTree(api, options);
  const response = await api.postCommits({
    message: options.message,
    author: options.author,
    committer: options.committer,
    signature: options.signature,
    parents: [treeResult.baseBranch.commit.sha],
    tree: treeResult.tree.sha,
  });
  return { ...treeResult, commit: response };
}
