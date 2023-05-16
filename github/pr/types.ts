import type { ReposOwnerRepoPullsPostResponse } from "../api/mod.ts";
import type {
  GitHubBranchResult,
  GitHubCreateOrUpdateBranchOptions,
} from "../branch/mod.ts";

/**
 * GitHubPRResult is the result of creating a PR.
 */
export interface GitHubPRResult extends GitHubBranchResult {
  pr: ReposOwnerRepoPullsPostResponse;
}

/**
 * GitHubCreatePROptions are options for creating a PR.
 */
export interface GitHubCreatePROptions
  extends GitHubCreateOrUpdateBranchOptions {
  title?: string;
  body?: string;
  maintainer_can_modify?: boolean;
  draft?: boolean;
  issue?: number;
  branchAction?: GitHubBranchAction;
}

/**
 * GitHubBranchAction is an action to take on a branch.
 */
export enum GitHubBranchAction {
  CREATE = "create",
  UPDATE = "update",
  CREATE_OR_UPDATE = "create_or_update",
}