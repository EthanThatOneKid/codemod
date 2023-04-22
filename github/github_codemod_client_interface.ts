import type { ReposOwnerRepoGitCommitsPostRequest } from "./api/mod.ts";

// Internally powered by a GitHubClientInterface.
export interface GitHubCodemodClientInterface {
  newCommit(options: NewGitHubCommitClientOptions): GitHubCommitClientInterface;
}

export type NewGitHubCommitClientOptions = ReposOwnerRepoGitCommitsPostRequest;

//-=---------------------------------------------------------------------------

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
  newBranch(options: NewGitHubBranchOptions): Promise<BranchClientInterface>;
}

export type NewGitHubBranchOptions = ReposOwnerRepoBranchPostRequest;

// export type NewBranchOptions = ReposOwnerRepoBranchPostRequest;

// Contains new commit.
export interface BranchClientInterface {
  newPR(options: NewGitHubPROptions): Promise<PRClientInterface>;
}

export type NewGitHubPROptions = ReposOwnerRepoPullsPostRequest;

// Contains new branch.
export interface PRClientInterface {
  finish(): Promise<PR>;
}

export type PR = ReposOwnerRepoPullsPostResponse;
