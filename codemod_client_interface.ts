import { ReposOwnerRepoGitCommitsPostRequest } from "./github_client_interface.ts";

// Internally powered by a GitHubCodemodClientInterface.
export interface CodemodClientInterface {
  newCommit(options: NewCommitOptions): CommitClientInterface;
}

export interface NewCommitOptions {
  message: string;
  branch: string;
}

export interface CommitClientInterface {
  // Via GitHubCommitClientInterface.add
  add(path: string, content: string): void;

  // Via add.
  remove(path: string): void;

  // Via add.
  move(from: string, to: string): void;

  // Via GitHubCommitClientInterface.edit
  edit(path: string, fn: (content: string) => string): Promise<void>;

  // Via edit.
  /**
   * @see https://github.com/acmcsufoss/codemod/blob/6fa45087b04b8129b55ee1cebf6bb4d208380f37/codemod.ts#L141
   */
  jsonPatch(path: string, value: unknown): Promise<void>;
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

// export type NewBranchOptions = ReposOwnerRepoBranchPostRequest;

// Contains new commit.
export interface BranchClientInterface {
  newPR(options: NewPROptions): Promise<PRClientInterface>;
}

// Contains new branch.
export interface PRClientInterface {
  finish(): Promise<PR>;
}
