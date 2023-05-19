import type { GitHubAPIClientInterface } from "../api/mod.ts";
import type { GitHubBranchResult } from "../branch/mod.ts";
import { createBranch, createOrUpdateBranch } from "../branch/mod.ts";
import { getDefaultBranchName } from "../tree/repo_metadata.ts";
import type { GitHubCreatePROptions, GitHubPRResult } from "./types.ts";
import { GitHubBranchAction } from "./types.ts";

/**
 * createPR creates a GitHub pull request.
 */
export async function createPR(
  api: GitHubAPIClientInterface,
  options: GitHubCreatePROptions,
): Promise<GitHubPRResult> {
  options.branchAction ??= GitHubBranchAction.CREATE_OR_UPDATE;
  let branchResult: GitHubBranchResult;
  switch (options.branchAction) {
    case GitHubBranchAction.CREATE: {
      branchResult = await createBranch(api, options);
      break;
    }

    case GitHubBranchAction.CREATE_OR_UPDATE: {
      branchResult = await createOrUpdateBranch(api, options);
      break;
    }

    default: {
      throw new Error(`Unknown branch action: ${options.branchAction}`);
    }
  }

  let base = options.baseBranchName ?? branchResult.defaultBranchName;
  if (!base) {
    const defaultBranchName = await getDefaultBranchName(api);
    base = defaultBranchName;
    branchResult.defaultBranchName = defaultBranchName;
  }

  console.log({ branchResult, options, base });
  const response = await api.postPulls({
    base,
    head: options.newBranchName,
    title: options.title,
    body: options.body,
    maintainer_can_modify: options.maintainerCanModify,
    issue: options.issue,
    draft: options.draft,
  });
  return { ...branchResult, pr: response };
}
