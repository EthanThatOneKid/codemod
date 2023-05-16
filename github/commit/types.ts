import type { ReposOwnerRepoGitCommitsPostResponse } from "../api/mod.ts";
import type { GitHubCreateTreeOptions, GitHubTreeResult } from "../tree/mod.ts";

/**
 * GitHubCommitResult is the result of creating a commit.
 */
export interface GitHubCommitResult extends GitHubTreeResult {
  commit: ReposOwnerRepoGitCommitsPostResponse;
}

/**
 * GitHubCreateCommitOptions are the options to create a commit.
 */
export interface GitHubCreateCommitOptions extends GitHubCreateTreeOptions {
  message: string;
  author?: GitHubAuthor;
  committer?: GitHubCommitter;
  signature?: string | undefined;
}

/**
 * GitHubAuthor is the author of a commit.
 */
export interface GitHubAuthor {
  name: string;
  email: string;
  date?: string | undefined;
}

/**
 * GitHubCommitter is the committer of a commit.
 */
interface GitHubCommitter {
  name?: string | undefined;
  email?: string | undefined;
  date?: string | undefined;
}
