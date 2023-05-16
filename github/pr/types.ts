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
}
