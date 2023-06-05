import type {
  GitHubAPIClientOptions,
  GitHubAPICommitsPostRequest,
  GitHubAPICommitsPostResponse,
  GitHubAPIPullPatchRequest,
  GitHubAPIPullPatchResponse,
  GitHubAPIPullsPostRequest,
  GitHubAPIPullsPostResponse,
  GitHubAPIRefPatchRequest,
  GitHubAPIRefPatchResponse,
  GitHubAPIRefsPostRequest,
  GitHubAPIRefsPostResponse,
  GitHubAPITreesPostRequest,
  GitHubAPITreesPostResponse,
} from "../api/mod.ts";
import type { Generate } from "../shared/generate.ts";
import type { Append } from "../shared/append.ts";
import { GitHubCreateTreeBuilderInterface } from "../tree/github_create_tree_builder_interface.ts";
import { GitHubCreateCommitBuilderInterface } from "../commit/github_create_commit_builder_interface.ts";
import { GitHubCreateBranchBuilderInterface } from "../branch/github_create_branch_builder_interface.ts";
import { GitHubUpdateBranchBuilderInterface } from "../branch/github_update_branch_builder_interface.ts";
import { GitHubCreatePRBuilderInterface } from "../pr/github_create_pr_builder_interface.ts";
import { GitHubUpdatePRBuilderInterface } from "../pr/github_update_pr_builder_interface.ts";

/**
 * GitHubCodemodBuilderInterface is a protocol for building and executing a
 * sequence of GitHub operations.
 */
export interface GitHubCodemodBuilderInterface<
  /**
   * R is the result type. By default, it is an empty tuple. As the instructions
   * are added, the result type is appended with the result of the instruction.
   */
  R extends Array<GitHubOpResult> = [],
> {
  /**
   * run executes the builder.
   */
  run(options: GitHubAPIClientOptions): Promise<R>;

  /**
   * op adds a GitHubOp to the builder.
   */
  op<T extends GitHubOp<R>>(
    opOrOpGenerate: Generate<T, [R]>,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubOpResultOf<R, T>]>
  >;

  /**
   * createTree adds a create GiHub tree action to the builder.
   */
  createTree(
    builderOrBuilderGenerate: Generate<
      GitHubCreateTreeBuilderInterface,
      [GitHubCreateTreeBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPITreesPostResponse]>
  >;

  /**
   * createCommit adds a create GiHub commit action to the builder.
   */
  createCommit(
    optionsOrOptionsGenerate: Generate<GitHubAPICommitsPostRequest, [R]>,
    builderOrBuilderGenerate?: Generate<
      GitHubCreateCommitBuilderInterface,
      [GitHubCreateCommitBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPICommitsPostResponse]>
  >;

  /**
   * createBranch adds a create GiHub branch action to the builder.
   */
  createBranch(
    optionsOrOptionsGenerate: Generate<GitHubAPIRefsPostRequest, [R]>,
    builderOrBuilderGenerate?: Generate<
      GitHubCreateBranchBuilderInterface,
      [GitHubCreateBranchBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIRefsPostResponse]>
  >;

  /**
   * updateBranch adds a update GiHub branch action to the builder.
   */
  updateBranch(
    optionsOrOptionsGenerate: Generate<GitHubAPIRefPatchRequest, [R]>,
    builderOrBuilderGenerate?: Generate<
      GitHubUpdateBranchBuilderInterface,
      [GitHubUpdateBranchBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIRefPatchResponse]>
  >;

  /**
   * createOrUpdateBranch adds a create or update GiHub branch action to the builder.
   */
  createOrUpdateBranch(
    createOptionsOrCreateOptionsGenerate: Generate<
      GitHubAPIRefsPostRequest,
      [R]
    >,
    updateOptionsOrUpdateOptionsGenerate: Generate<
      GitHubAPIRefPatchRequest,
      [R]
    >,
    createBuilderOrCreateBuilderGenerate?: Generate<
      GitHubCreateBranchBuilderInterface,
      [GitHubCreateBranchBuilderInterface, R]
    >,
    updateBuilderOrUpdateBuilderGenerate?: Generate<
      GitHubUpdateBranchBuilderInterface,
      [GitHubUpdateBranchBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIRefPatchResponse]>
  >;

  /**
   * createPR adds a create GiHub PR action to the builder.
   */
  createPR(
    optionsOrOptionsGenerate: Generate<GitHubAPIPullsPostRequest, [R]>,
    builderOrBuilderGenerate?: Generate<
      GitHubCreatePRBuilderInterface,
      [GitHubCreatePRBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIPullsPostResponse]>
  >;

  /**
   * updatePR adds a update GiHub PR action to the builder.
   */
  updatePR(
    optionsOrOptionsGenerate: Generate<GitHubAPIPullPatchRequest, [R]>,
    builderOrBuilderGenerate?: Generate<
      GitHubUpdatePRBuilderInterface,
      [GitHubUpdatePRBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIPullPatchResponse]>
  >;

  /**
   * createOrUpdatePR adds a create or update GiHub PR action to the builder.
   */
  createOrUpdatePR(
    createOptionsOrCreateOptionsGenerate: Generate<
      GitHubAPIPullsPostRequest,
      [R]
    >,
    updateOptionsOrUpdateOptionsGenerate: Generate<
      GitHubAPIPullPatchRequest,
      [R]
    >,
    createBuilderOrCreateBuilderGenerate?: Generate<
      GitHubCreatePRBuilderInterface,
      [GitHubCreatePRBuilderInterface, R]
    >,
    updateBuilderOrUpdateBuilderGenerate?: Generate<
      GitHubUpdatePRBuilderInterface,
      [GitHubUpdatePRBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIPullPatchResponse]>
  >;
}

/**
 * GitHubAPITreesPostRequestGenerate is a function to generate a GitHubAPITreesPostRequest.
 */
export type GitHubAPITreesPostRequestGenerate<T> = Generate<
  GitHubAPITreesPostRequest,
  [T]
>;

/**
 * GitHubAPICommitsPostRequestGenerate is a function to generate a GitHubAPICommitsPostRequest.
 */
export type GitHubAPICommitsPostRequestGenerate<T> = Generate<
  GitHubAPICommitsPostRequest,
  [T]
>;

/**
 * GitHubAPIRefsPostRequestGenerate is a function to generate a GitHubAPIRefsPostRequest.
 */
export type GitHubAPIRefsPostRequestGenerate<T> = Generate<
  GitHubAPIRefsPostRequest,
  [T]
>;

/**
 * GitHubAPIRefPatchRequestGenerate is a function to generate a GitHubAPIRefPatchRequest.
 */
export type GitHubAPIRefPatchRequestGenerate<T> = Generate<
  GitHubAPIRefPatchRequest,
  [T]
>;

/**
 * GitHubAPIPullsPostRequestGenerate is a function to generate a GitHubAPIPullsPostRequest.
 */
export type GitHubAPIPullsPostRequestGenerate<T> = Generate<
  GitHubAPIPullsPostRequest,
  [T]
>;

/**
 * GitHubAPIPullPatchRequestGenerate is a function to generate a GitHubAPIPullsPullNumberPatchRequest.
 */
export type GitHubAPIPullPatchRequestGenerate<T> = Generate<
  GitHubAPIPullPatchRequest,
  [T]
>;

/**
 * GitHubOp is a GitHub operation.
 */
export type GitHubOp<R> =
  | GitHubTreeOp<R>
  | GitHubCommitOp<R>
  | GitHubBranchOp<R>
  | GitHubPROp<R>;

/**
 * GitHubOpResult is a GitHub op result.
 */
export type GitHubOpResult =
  | GitHubAPITreesPostResponse
  | GitHubAPICommitsPostResponse
  | GitHubAPIRefsPostResponse
  | GitHubAPIRefPatchResponse
  | GitHubAPIPullsPostResponse
  | GitHubAPIPullPatchResponse;

/**
 * GitHubOpResultOf is the result of a GitHubOp.
 */
export type GitHubOpResultOf<R, T extends GitHubOp<R>> = T extends
  GitHubTreeOp<unknown[]> ? GitHubAPITreesPostResponse
  : T extends GitHubCommitOp<unknown[]> ? GitHubAPICommitsPostResponse
  : T extends GitHubBranchOp<unknown[]>
    ? GitHubAPIRefsPostResponse | GitHubAPIRefPatchResponse
  : T extends GitHubPROp<unknown[]>
    ? GitHubAPIPullsPostResponse | GitHubAPIPullPatchResponse
  : never;

/**
 * GitHubTreeOp is a GitHub tree operation.
 */
export type GitHubTreeOp<R> = {
  type: GitHubOpType.CREATE_TREE;
  data: GitHubAPITreesPostRequestGenerate<R>;
};

/**
 * GitHubCommitOp is a GitHub commit operation.
 */
export type GitHubCommitOp<R> = {
  type: GitHubOpType.CREATE_COMMIT;
  data: GitHubAPICommitsPostRequestGenerate<R>;
};

/**
 * GitHubBranchOp is a GitHub branch operation.
 *
 * TODO: Add delete branch.
 */
export type GitHubBranchOp<R> =
  | {
    type: GitHubOpType.CREATE_BRANCH;
    data: GitHubAPIRefsPostRequestGenerate<R>;
  }
  | {
    type: GitHubOpType.UPDATE_BRANCH;
    data: GitHubAPIRefPatchRequestGenerate<R>;
  };

/**
 * GitHubPROp is a PR action.
 *
 * TODO: Add delete PR.
 */
export type GitHubPROp<R> =
  | {
    type: GitHubOpType.CREATE_PR;
    data: GitHubAPIPullsPostRequestGenerate<R>;
  }
  | {
    type: GitHubOpType.UPDATE_PR;
    data: GitHubAPIPullPatchRequestGenerate<R>;
  };

/**
 * GitHubOpType is a GitHub operation type.
 */
export enum GitHubOpType {
  CREATE_TREE = "createTree",
  CREATE_COMMIT = "createCommit",
  CREATE_BRANCH = "createBranch",
  UPDATE_BRANCH = "updateBranch",
  CREATE_PR = "createPR",
  UPDATE_PR = "updatePR",
}
