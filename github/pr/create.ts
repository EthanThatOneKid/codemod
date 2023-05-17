import type { GitHubAPIClientInterface } from "../api/mod.ts";
import type {
  GitHubBranchResult,
  GitHubCreateOrUpdateBranchOptions,
} from "../branch/mod.ts";
import {
  createBranch,
  createOrUpdateBranch,
  updateBranch,
} from "../branch/mod.ts";
import type { GitHubCreatePROptions, GitHubPRResult } from "./types.ts";
import { GitHubBranchAction } from "./types.ts";

/**
 * createPR creates a GitHub pull request.
 */
export async function createPR(
  api: GitHubAPIClientInterface,
  options: GitHubCreatePROptions,
): Promise<GitHubPRResult> {
  const branchResult = await doBranch(
    api,
    options.branchAction ?? GitHubBranchAction.CREATE_OR_UPDATE,
    options,
  );
  const response = await api.postPulls({
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

export async function doBranch(
  api: GitHubAPIClientInterface,
  action: GitHubBranchAction,
  options: GitHubCreateOrUpdateBranchOptions,
): Promise<GitHubBranchResult> {
  switch (action) {
    case GitHubBranchAction.CREATE: {
      return await createBranch(api, options);
    }
    case GitHubBranchAction.UPDATE: {
      return await updateBranch(api, options);
    }
    case GitHubBranchAction.CREATE_OR_UPDATE: {
      return await createOrUpdateBranch(api, options);
    }
    default: {
      throw new Error(`Unknown branch action: ${action}`);
    }
  }
}
