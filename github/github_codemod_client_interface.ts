import { codemod } from "../codemod.ts";
import type {
  ReposOwnerRepoGitCommitsPostRequest,
  ReposOwnerRepoGitCommitsPostResponse,
  ReposOwnerRepoGitRefsPostRequest,
  ReposOwnerRepoGitRefsPostResponse,
  ReposOwnerRepoGitTreesPostRequest,
  ReposOwnerRepoPullsPostRequest,
  ReposOwnerRepoPullsPostResponse,
} from "./api/mod.ts";
import { GitHubCodemodClient } from "./github_codemod_client.ts";

/**
 * GitHubCodemodClientInterface is the protocol for a GitHub Codemod client.
 */
export interface GitHubCodemodClientInterface {
  /**
   * createTreeClient creates a new GitHub tree client to kick off a codemod.
   */
  createTreeClient(): GitHubTreeClientInterface;
}

/**
 * GitHubTreeClientInterface is the protocol for a GitHub tree client.
 */
export interface GitHubTreeClientInterface {
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
   * create creates a new tree.
   */
  create(options: GitHubTreeClientOptions): Promise<GitHubTree>;

  /**
   * createCommitClient creates a new tree and commit client.
   */
  createCommitClient(
    options: GitHubCommitClientOptions,
  ): Promise<GitHubCommitClientInterface>;
}

/**
 * GitHubCommitClientInterface is the protocol for a GitHub commit client.
 *
 * GitHubCommitClientInterface implementation stores your tree, base tree SHA,
 * and base commit SHA in memory.
 */
export interface GitHubCommitClientInterface {
  create(): Promise<GitHubCommit>;
  createBranch(
    options: GitHubBranchClientOptions,
  ): Promise<GitHubBranchClientInterface>;
  createPR(
    options: GitHubPRClientOptions,
  ): Promise<GitHubPRClientInterface>;
}

const pr = await codemod(
  codemodPROptions,
  codemodBranchOptions,
  codemodCommitOptions,
  codemodTreeOptions,
);

const branch = await codemod(
  codemodBranchOptions,
  codemodCommitOptions,
  codemodTreeOptions,
);

const commit = await codemod(
  codemodCommitOptions,
  codemodTreeOptions,
);

const tree = await codemod(
  codemodTreeOptions,
);

// Compose tree and commit options into a new commit.
// Compose commit and branch options into a new branch.
// Compose branch and pr options into a new pr.

const pr = await treeClient
  .addFile("hello.txt", "hello world\n")
  .addFile("hello2.txt", "hello world2\n")
  .create()
  // .then((tree) => commitClient.create({ tree }))
  .then(commitClient.fromTree(commitOptions))
  // .then((commit) => branchClient.create({ commit }))
  .then(branchClient.fromCommit(branchOptions))
  // .then((branch) => prClient.create({ branch }));
  .then(prClient.fromBranch(prOptions));

const commit = await commitClient.create({ tree });
const branch = await branchClient.create({ commit });
const pr = await prClient.create({ branch });

// const commit = await tree
//   .addFile()
//   .addFile()
//   .createCommit();

// await commit.create()
//   .createBranch();

// await;

// client.createBranch();

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
 * GitHubBranchClientInterface is the protocol for a GitHub branch client.
 */
export interface GitHubBranchClientInterface {
  /**
   * create creates a new branch.
   */
  create(): Promise<GitHubBranch>;

  /**
   * createPR creates a new branch.
   */
  createPR(options: GitHubPRClientOptions): Promise<GitHubPRClientInterface>;

  /**
   * updateBranch updates an existing branch.
   */
  update(): Promise<GitHubBranch>;

  /**
   * updatePR updates an existing PR.
   */
  updatePR(
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
export type GitHubPRClientOptions = Omit<
  ReposOwnerRepoPullsPostRequest,
  "base" | "head"
>;

/**
 * PRClientInterface is the protocol for a GitHub PR client.
 */
export interface GitHubPRClientInterface {
  /**
   * newPR creates a new PR.
   */
  commit(): Promise<GitHubPR>;
}

/**
 * GitHubPR is the struct for a GitHub PR.
 */
export type GitHubPR = ReposOwnerRepoPullsPostResponse;
