import type {
  ReposOwnerRepoGitCommitsPostRequest,
  ReposOwnerRepoGitRefsPostRequest,
  ReposOwnerRepoPullsPostRequest,
  ReposOwnerRepoPullsPostResponse,
} from "./api/mod.ts";

/**
 * GitHubCodemodClientInterface is the protocol for a GitHub Codemod client.
 */
export interface GitHubCodemodClientInterface {
  /**
   * newCommit creates a new GitHub commit client.
   */
  newCommit(
    options: NewGitHubCommitClientOptions,
  ): Promise<GitHubCommitClientInterface>;
}

/**
 * NewGitHubCommitOptions are the options for creating a new GitHub commit.
 */
export type NewGitHubCommitClientOptions = ReposOwnerRepoGitCommitsPostRequest;

/**
 * GitHubCommitClientInterface is the protocol for a GitHub commit client.
 *
 * GitHubCommitClientInterface implementation stores your tree, base tree SHA,
 * and base commit SHA in memory.
 */
export interface GitHubCommitClientInterface {
  /**
   * add adds a file to the commit.
   */
  add(path: string, content: string): Promise<void>;

  /**
   * edit edits a file in the commit. The content is passed to the function
   * which returns the new content for the file.
   */
  edit(path: string, fn: (content: string) => string): Promise<void>;

  /**
   * newBranch creates a new GitHub branch client.
   */
  newBranch(
    options: NewGitHubBranchOptions,
  ): Promise<GitHubBranchClientInterface>;
}

/**
 * NewBranchOptions are the options for creating a new branch.
 */
export type NewGitHubBranchOptions = ReposOwnerRepoGitRefsPostRequest;

/**
 * GitHubBranchClientInterface is the protocol for a GitHub branch client.
 */
export interface GitHubBranchClientInterface {
  newPR(options: NewGitHubPROptions): Promise<GitHubPRClientInterface>;
}

/**
 * NewGitHubPROptions are the options for creating a new PR.
 */
export type NewGitHubPROptions = ReposOwnerRepoPullsPostRequest;

/**
 * PRClientInterface is the protocol for a GitHub PR client.
 *
 * Privately stores the branch name.
 */
export interface GitHubPRClientInterface {
  open(): Promise<GitHubPR>;
}

/**
 * GitHubPR is the struct for a GitHub PR.
 */
export type GitHubPR = ReposOwnerRepoPullsPostResponse;
