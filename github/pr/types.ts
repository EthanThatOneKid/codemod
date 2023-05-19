import type { GitHubAPIPullsPostResponse } from "../api/mod.ts";
import type {
  GitHubBranchResult,
  GitHubCreateBranchOptions,
  GitHubCreateOrUpdateBranchOptions,
} from "../branch/mod.ts";

/**
 * GitHubPRResult is the result of creating a PR.
 */
export interface GitHubPRResult extends GitHubBranchResult {
  pr: GitHubAPIPullsPostResponse;
}

/**
 * GitHubCreatePROptions are options for creating a PR.
 */
export type GitHubCreatePROptions =
  & {
    headBranchName?: string;
    title?: string;
    body?: string;
    maintainerCanModify?: boolean;
    draft?: boolean;
    issue?: number;
  }
  & (
    | (
      & { branchAction: GitHubBranchAction.CREATE }
      & GitHubCreateBranchOptions
    )
    | { branchAction?: GitHubBranchAction.CREATE_OR_UPDATE }
      & GitHubCreateOrUpdateBranchOptions
  );

/**
 * GitHubBranchAction is an action to take on a branch.
 */
export enum GitHubBranchAction {
  CREATE = "create",
  CREATE_OR_UPDATE = "create_or_update",
}
