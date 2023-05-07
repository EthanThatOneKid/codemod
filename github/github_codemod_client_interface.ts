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
   * newCodemod creates a new GitHub commit client to kick off a codemod.
   */
  newCodemod(
    options: GitHubCommitClientOptions,
  ): Promise<GitHubCommitClientInterface>;
}

/**
 * GitHubCommitClientOptions are the options for creating a new GitHub commit.
 */
export type GitHubCommitClientOptions = ReposOwnerRepoGitCommitsPostRequest;

/**
 * GitHubCommitClientInterface is the protocol for a GitHub commit client.
 *
 * GitHubCommitClientInterface implementation stores your tree, base tree SHA,
 * and base commit SHA in memory.
 */
export interface GitHubCommitClientInterface {
  /**
   * addFile adds a base64 encoded file to the commit.
   */
  addFile(path: string, blob: Blob): void;

  /**
   * addTextFile adds a utf-8 file to the commit.
   */
  addTextFile(path: string, content: string): void;

  /**
   * editFile edits a file in the commit. The content is passed to the function
   * which returns the new content for the file.
   */
  editFile(path: string, fn: (blob: Blob) => Blob): void;

  /**
   * edit edits a file in the commit. The content is passed to the function
   * which returns the new content for the file.
   */
  editTextFile(path: string, fn: (content: string) => string): void;

  /**
   * newCommit makes a new commit.
   */
  newCommit(): Promise<void>;
  newCommit(options: GitHubBranchOptions): Promise<GitHubBranchClientInterface>;
}

/**
 * GitHubBranchOptions are the options for creating a new branch.
 */
export type GitHubBranchOptions = ReposOwnerRepoGitRefsPostRequest;

/**
 * GitHubBranchClientInterface is the protocol for a GitHub branch client.
 */
export interface GitHubBranchClientInterface {
  /**
   * newBranch creates a new branch.
   */
  newBranch(): Promise<void>;
  newBranch(options: GitHubPROptions): Promise<GitHubPRClientInterface>;
}

/**
 * GitHubPROptions are the options for creating a new PR.
 */
export type GitHubPROptions = ReposOwnerRepoPullsPostRequest;

/**
 * PRClientInterface is the protocol for a GitHub PR client.
 */
export interface GitHubPRClientInterface {
  /**
   * newPR creates a new PR.
   */
  newPR(): Promise<GitHubPR>;
}

/**
 * GitHubPR is the struct for a GitHub PR.
 */
export type GitHubPR = ReposOwnerRepoPullsPostResponse;
