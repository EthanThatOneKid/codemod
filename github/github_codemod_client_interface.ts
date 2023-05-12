import type {
  ReposOwnerRepoGitCommitsPostRequest,
  ReposOwnerRepoGitCommitsPostResponse,
  ReposOwnerRepoGitRefsPostRequest,
  ReposOwnerRepoGitRefsPostResponse,
  ReposOwnerRepoGitTreesPostRequest,
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
   * deleteFile deletes a file in the commit.
   */
  deleteFile(path: string): void;

  /**
   * newCommit makes a new commit.
   */
  newCommit(): Promise<GitHubCommit>;
  newCommit(
    options: GitHubBranchClientOptions,
  ): Promise<GitHubBranchClientInterface>;
}

/**
 * GitHubTreeItem is a single node in a GitHub tree.
 */
export type GitHubTreeItem = GitHubTree[number];

/**
 * GitHubTree is a GitHub tree.
 */
export type GitHubTree = ReposOwnerRepoGitTreesPostRequest["tree"];

/**
 * GitHubCommit is the struct for a GitHub commit.
 */
export type GitHubCommit = ReposOwnerRepoGitCommitsPostResponse;

/**
 * GitHubBranchClientOptions are the options for creating a new branch.
 */
export type GitHubBranchClientOptions = ReposOwnerRepoGitRefsPostRequest;

/**
 * GitHubBranchClientInterface is the protocol for a GitHub branch client.
 */
export interface GitHubBranchClientInterface {
  /**
   * newBranch creates a new branch.
   */
  newBranch(): Promise<GitHubBranch>;
  newBranch(options: GitHubPRClientOptions): Promise<GitHubPRClientInterface>;

  /**
   * updateBranch updates an existing branch.
   */
  updateBranch(): Promise<GitHubBranch>;
  updateBranch(
    options: GitHubPRClientOptions,
  ): Promise<GitHubPRClientInterface>;
}

/**
 * GitHubBranch is the struct for a GitHub branch.
 */
export type GitHubBranch = ReposOwnerRepoGitRefsPostResponse;

/**
 * GitHubPRClientOptions are the options for creating a new PR.
 */
export type GitHubPRClientOptions = ReposOwnerRepoPullsPostRequest;

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
