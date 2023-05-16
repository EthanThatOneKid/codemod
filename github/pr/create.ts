import type { GitHubAPIClientInterface } from "../api/mod.ts";
import { createOrUpdateBranch } from "../branch/create_or_update.ts";
import type { GitHubCreatePROptions, GitHubPRResult } from "./types.ts";

/**
 * createPR creates a GitHub pull request.
 */
export async function createPR(
  api: GitHubAPIClientInterface,
  options: GitHubCreatePROptions,
): Promise<GitHubPRResult> {
  const branchResult = await createOrUpdateBranch(api, options);
  const response = await api.postReposOwnerRepoPulls({
    base: branchResult.baseBranch.name,
    head: branchResult.branch.ref,
    title: options.title,
    body: options.body,
    maintainer_can_modify: options.maintainer_can_modify,
    issue: options.issue,
    draft: options.draft,
  });
  return { ...branchResult, pr: response };
}
