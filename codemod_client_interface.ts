import { ReposOwnerRepoGitCommitsPostRequest } from "./github_client_interface.ts";

/**
 * CodemodClientInterface is the protocol for a Codemod client.
 *
 * CodemodClientInterface is a wrapper around a GitHubCodemodClientInterface.
 * CodemodClientInterface provides a minimal approach to create commits, branches,
 * and PRs to repositories. If you need more control over the commit, branch, or
 * PR, use the GitHubCodemodClientInterface directly.
 *
 * Future work: Refactor CodemodClientInterface to be version control agnostic.
 * It is assumed that all version control providers have equivalents for GitHub's
 * commit, branch, and PR APIs. CodemodClientInterface is intended to be a
 * normalized interface for creating commits, branches, and PRs.
 */
export interface CodemodClientInterface {
  newCommit(options: NewCodemodCommitOptions): CodemodCommitClientInterface;
}

/**
 * NewCodemodCommitOptions are the options for creating a new commit.
 */
export interface NewCodemodCommitOptions {
  message: string;
  branch: string;
}

/**
 * CodemodCommitClientInterface is the protocol for a codemod commit client.
 */
export interface CodemodCommitClientInterface {
  /**
   * add adds a file to the commit.
   *
   * TODO:
   * Implemented via GitHubCommitClientInterface.add().
   */
  add(path: string, content: string): void;

  /**
   * remove removes a file from the commit.
   *
   * TODO:
   * Implemented via this.add().
   */
  remove(path: string): void;

  /**
   * move moves a file from one path to another.
   *
   * TODO:
   * Implemented via this.add(). See: https://stackoverflow.com/a/72726316.
   */
  move(from: string, to: string): void;

  /**
   * edit edits a file in the commit.
   *
   * TODO: Via GitHubCommitClientInterface.edit().
   */
  edit(path: string, fn: (content: string) => string): Promise<void>;

  /**
   * jsonpatch applies a JSON patch to a file in the commit.
   *
   * TODO: Via this.edit().
   */
  jsonpatch(path: string, value: unknown): Promise<void>;
}

// TODO: Define a Codemod branded type for NewCommitOption that maps to the GitHub API's ReposOwnerRepoGitCommitsPostRequest.

// Builds an internal tree to be used for creating a commit.
// Stores the tree, base tree SHA, and base commit SHA in memory.
export interface GitHubCommitClientInterface {
  // TODO: Use a type for a single Tree item for the add method. Leave remove, move, and edit for external CommitClientInterface.
  add(path: string, content: string): void;
  edit(path: string, fn: (content: string) => string): Promise<void>;
  //   patchJSON(path: string, value: unknown): Promise<void>;
  //   setFile(path: string, content: string): Promise<void>;
  //   deleteFile(path: string): Promise<void>;
  //   // https://stackoverflow.com/a/72726316
  //   moveFile(from: string, to: string): Promise<void>;
  //   finish(): Promise<string>;
  newBranch(options: NewBranchOptions): Promise<BranchClientInterface>;
}

export interface NewBranchOptions {
  name: string;
  base: string;
}

// Contains new commit.
export interface BranchClientInterface {
  newPR(options: NewPROptions): Promise<PRClientInterface>;
}

// Contains new branch.
export interface PRClientInterface {
  finish(): Promise<PR>;
}
