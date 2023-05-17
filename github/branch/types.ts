import type { GitHubAPIRefsPostResponse } from "../api/mod.ts";
import type {
  GitHubCommitResult,
  GitHubCreateCommitOptions,
} from "../commit/mod.ts";

/**
 * GitHubBranchResult is the result of creating a branch.
 */
export interface GitHubBranchResult extends GitHubCommitResult {
  branch: GitHubAPIRefsPostResponse;
}

/**
 * GitHubCreateBranchOptions are the options to create a branch.
 */
export interface GitHubCreateBranchOptions extends GitHubCreateCommitOptions {
  headBranchName: string;
}

/**
 * GitHubUpdateBranchOptions are the options to update a branch.
 */
export interface GitHubUpdateBranchOptions extends GitHubCreateBranchOptions {
  force?: boolean;
}

/**
 * GitHubCreateOrUpdateBranchOptions are the options to create or update a branch.
 */
export type GitHubCreateOrUpdateBranchOptions = GitHubUpdateBranchOptions;
