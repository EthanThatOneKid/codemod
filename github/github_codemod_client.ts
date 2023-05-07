import { ReposOwnerRepoGitTreesPostRequest } from "./api/github_api_client_interface.ts";
import type { GitHubAPIClientInterface } from "./api/mod.ts";
import type {
  GitHubBranchClientInterface,
  GitHubBranchOptions,
  GitHubCodemodClientInterface,
  GitHubCommitClientInterface,
  GitHubCommitClientOptions,
  GitHubPRClientInterface,
  GitHubPROptions,
} from "./github_codemod_client_interface.ts";

// TODO: makeCommit should use fromBlob.
import { fromBlob } from "./base64.ts";

/**
 * GitHubCodemodClient is a GitHub Codemod client.
 */
export class GitHubCodemodClient implements GitHubCodemodClientInterface {
  constructor(private readonly apiClient: GitHubAPIClientInterface) {}

  public async newCommit(
    options: GitHubCommitClientOptions,
  ): Promise<GitHubCommitClientInterface> {
    return Promise.resolve(new GitHubCommitClient(this.apiClient, options));
  }
}

/**
 * GitHubCommitClient is a GitHub commit client.
 */
export class GitHubCommitClient implements GitHubCommitClientInterface {
  private tree = new Map<string, GitHubCodemod>();

  constructor(
    private readonly apiClient: GitHubAPIClientInterface,
    private readonly options: GitHubCommitClientOptions,
  ) {}

  public addFile(path: string, blob: Blob): void {
    this.tree.set(path, {
      type: GitHubCodemodType.ADD_FILE,
      blob,
    });
  }

  public addTextFile(path: string, content: string): void {
    this.tree.set(path, {
      type: GitHubCodemodType.ADD_TEXT_FILE,
      content,
    });
  }

  public editFile(path: string, fn: (blob: Blob) => Blob): void {
    this.tree.set(path, {
      type: GitHubCodemodType.EDIT_FILE,
      fn,
    });
  }

  public editTextFile(
    path: string,
    fn: (content: string) => string,
  ): void {
    this.tree.set(path, {
      type: GitHubCodemodType.EDIT_TEXT_FILE,
      fn,
    });
  }

  public async newCommit(): Promise<GitHubCommitClientInterface> {
  }

  public async newBranch(
    options: GitHubBranchOptions,
  ): Promise<GitHubBranchClientInterface> {
    return Promise.resolve(new GitHubBranchClient(this.apiClient, options));
  }
}

/**
 * GitHubCodemod is a file modification. It can be a new file, an edit, or a delete.
 *
 * The file mods are stored in a map where they will wait to be executed.
 */
export type GitHubCodemod =
  | GitHubCodemodAddFile
  | GitHubCodemodAddTextFile
  | GitHubCodemodEditFile
  | GitHubCodemodEditTextFile;

/**
 * GitHubCodemodType is the type of a GitHub codemod.
 */
export enum GitHubCodemodType {
  ADD_FILE,
  ADD_TEXT_FILE,
  EDIT_FILE,
  EDIT_TEXT_FILE,
}

/**
 * GitHubCodemodAddFile contains a blob which is associated with a path.
 */
export interface GitHubCodemodAddFile {
  type: GitHubCodemodType.ADD_FILE;
  blob: Blob;
}

/**
 * GitHubCodemodAddTextFile contains a string which is associated with a path.
 */
export interface GitHubCodemodAddTextFile {
  type: GitHubCodemodType.ADD_TEXT_FILE;
  content: string;
}

/**
 * GitHubCodemodEditFile contains a function which edits a blob.
 */
export interface GitHubCodemodEditFile {
  type: GitHubCodemodType.EDIT_FILE;
  fn: (blob: Blob) => Blob;
}

/**
 * GitHubCodemodEditTextFile contains a function which edits a string.
 */
export interface GitHubCodemodEditTextFile {
  type: GitHubCodemodType.EDIT_TEXT_FILE;
  fn: (content: string) => string;
}

/**
 * GitHubBranchClient is a GitHub branch client.
 */
export class GitHubBranchClient implements GitHubBranchClientInterface {
  constructor(
    private readonly apiClient: GitHubAPIClientInterface,
    private readonly options: GitHubBranchOptions,
  ) {}

  public async newPR(
    options: GitHubPROptions,
  ): Promise<GitHubPRClientInterface> {
    throw new Error("Not implemented");
  }
}

/**
 * GitHubTreeItem is a single node in a GitHub tree.
 */
export type GitHubTreeItem = GitHubTree[number];

/**
 * GitHubTree is a GitHub tree.
 */
export type GitHubTree = ReposOwnerRepoGitTreesPostRequest["tree"];
