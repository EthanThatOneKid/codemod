import type { GitHubCreateTreeOptions, GitHubTreeResult } from "./tree/mod.ts";
import type {
  GitHubCommitResult,
  GitHubCreateCommitOptions,
} from "./commit/mod.ts";
import type {
  GitHubBranchResult,
  GitHubCreateBranchOptions,
  GitHubCreateOrUpdateBranchOptions,
  GitHubUpdateBranchOptions,
} from "./branch/mod.ts";
import type { GitHubCreatePROptions, GitHubPRResult } from "./pr/mod.ts";

/**
 * GitHubCodemodBuilderInterface is a protocol for building a GitHub codemod.
 */
export interface GitHubCodemodBuilderInterface {
  /**
   * setBlob sets a base64 encoded file to the commit.
   */
  setBlob(path: string, blob: Blob): this;

  /**
   * setText sets a utf-8 file to the commit.
   */
  setText(path: string, content: string): this;

  /**
   * editBlob edits a base64 encoded file in the commit.
   */
  editBlob(path: string, fn: (blob: Blob) => Promise<Blob> | Blob): this;

  /**
   * editText edits a utf-8 file in the commit.
   */
  editText(
    path: string,
    fn: (content: string) => Promise<string> | string,
  ): this;

  /**
   * deleteFile deletes a file in the commit.
   */
  delete(path: string): this;

  /**
   * clone clones the builder as a new instance.
   */
  clone(): GitHubCodemodBuilderInterface;

  /**
   * createTree creates a tree using the GitHub API.
   */
  createTree(
    options: GitHubCodemodBuilderCreateTreeOptions,
  ): Promise<GitHubTreeResult>;

  /**
   * createCommit creates a commit using the GitHub API.
   */
  createCommit(
    options: GitHubCodemodBuilderCreateCommitOptions,
  ): Promise<GitHubCommitResult>;

  /**
   * createBranch creates a branch using the GitHub API.
   */
  createBranch(
    options: GitHubCodemodBuilderCreateBranchOptions,
  ): Promise<GitHubBranchResult>;

  /**
   * updateBranch updates a branch using the GitHub API.
   */
  updateBranch(
    options: GitHubCodemodBuilderUpdateBranchOptions,
  ): Promise<GitHubBranchResult>;

  /**
   * createOrUpdateBranch creates or updates a branch using the GitHub API.
   */
  createOrUpdateBranch(
    options: GitHubCodemodBuilderCreateOrUpdateBranchOptions,
  ): Promise<GitHubBranchResult>;

  /**
   * createPR creates a PR using the GitHub API.
   */
  createPR(
    options: GitHubCodemodBuilderCreatePROptions,
  ): Promise<GitHubPRResult>;
}

/**
 * GitHubCodemodBuilderCreateTreeOptions is the options for the createTree method.
 */
export type GitHubCodemodBuilderCreateTreeOptions = OmitCodemods<
  GitHubCreateTreeOptions
>;

/**
 * GitHubCodemodBuilderCreateCommitOptions is the options for the createCommit method.
 */
export type GitHubCodemodBuilderCreateCommitOptions = OmitCodemods<
  GitHubCreateCommitOptions
>;

/**
 * GitHubCodemodBuilderCreateBranchOptions is the options for the createBranch method.
 */
export type GitHubCodemodBuilderCreateBranchOptions = OmitCodemods<
  GitHubCreateBranchOptions
>;

/**
 * GitHubCodemodBuilderUpdateBranchOptions is the options for the updateBranch method.
 */
export type GitHubCodemodBuilderUpdateBranchOptions = OmitCodemods<
  GitHubUpdateBranchOptions
>;

/**
 * GitHubCodemodBuilderCreateOrUpdateBranchOptions is the options for the createOrUpdateBranch method.
 */
export type GitHubCodemodBuilderCreateOrUpdateBranchOptions = OmitCodemods<
  GitHubCreateOrUpdateBranchOptions
>;

/**
 * GitHubCodemodBuilderCreatePROptions is the options for the createPR method.
 */
export type GitHubCodemodBuilderCreatePROptions = OmitCodemods<
  GitHubCreatePROptions
>;

/**
 * OmitCodemods is a helper type to omit the 'codemods' property from a type.
 */
export type OmitCodemods<T> = Omit<T, "codemods">;
