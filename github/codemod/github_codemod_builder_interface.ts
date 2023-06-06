import type {
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
  run(): Promise<R>;

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
    Append<R, [GitHubCreateTreeOpResult]>
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
    Append<R, [GitHubCreateCommitOpResult]>
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
    Append<R, [GitHubCreateBranchOpResult]>
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
    Append<R, [GitHubUpdateBranchOpResult]>
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
    Append<R, [GitHubCreateOrUpdateBranchOpResult]>
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
    Append<R, [GitHubCreatePROpResult]>
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
    Append<R, [GitHubUpdatePROpResult]>
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
    Append<R, [GitHubCreateOrUpdatePROpResult]>
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
 * GitHubAPIRefsPostRequestAndGitHubAPIRefPatchRequestGenerate is a function to generate a
 * GitHubAPIRefsPostRequest and GitHubAPIRefPatchRequest.
 */
export type GitHubAPIRefsPostRequestAndGitHubAPIRefPatchRequestGenerate<
  T,
> = Generate<{
  create: GitHubAPIRefsPostRequest;
  update: GitHubAPIRefPatchRequest;
}, [T]>;

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
 * GitHubAPIPullsPostRequestAndGitHubAPIPullPatchRequestGenerate is a function to generate a
 * GitHubAPIPullsPostRequest and GitHubAPIPullPatchRequest.
 */
export type GitHubAPIPullsPostRequestAndGitHubAPIPullPatchRequestGenerate<
  T,
> = Generate<{
  create: GitHubAPIPullsPostRequest;
  update: GitHubAPIPullPatchRequest;
}, [T]>;

/**
 * GitHubOp is a GitHub operation.
 */
export type GitHubOp<R> =
  | GitHubCreateTreeOp<R>
  | GitHubCreateCommitOp<R>
  | GitHubCreateBranchOp<R>
  | GitHubUpdateBranchOp<R>
  | GitHubCreateOrUpdateBranchOp<R>
  | GitHubCreatePROp<R>
  | GitHubUpdatePROp<R>
  | GitHubCreateOrUpdatePROp<R>;

/**
 * GitHubOpResult is a GitHub op result.
 */
export type GitHubOpResult =
  | GitHubCreateTreeOpResult
  | GitHubCreateCommitOpResult
  | GitHubCreateBranchOpResult
  | GitHubUpdateBranchOpResult
  | GitHubCreateOrUpdateBranchOpResult
  | GitHubCreatePROpResult
  | GitHubUpdatePROpResult
  | GitHubCreateOrUpdatePROpResult;

/**
 * GitHubCreateTreeOpResult is a GitHub create tree op result.
 */
export type GitHubCreateTreeOpResult = GitHubAPITreesPostResponse;

/**
 * GitHubCreateCommitOpResult is a GitHub create commit tree op result.
 */
export type GitHubCreateCommitOpResult = GitHubAPICommitsPostResponse;

/**
 * GitHubCreateBranchOpResult is a GitHub create branch op result.
 */
export type GitHubCreateBranchOpResult = GitHubAPIRefsPostResponse;

/**
 * GitHubUpdateBranchOpResult is a GitHub update branch op result.
 */
export type GitHubUpdateBranchOpResult = GitHubAPIRefPatchResponse;

/**
 * GitHubCreateOrUpdateBranchOpResult is a GitHub create or update branch op result.
 */
export type GitHubCreateOrUpdateBranchOpResult =
  | { type: GitHubOpType.CREATE_BRANCH; data: GitHubCreateBranchOpResult }
  | { type: GitHubOpType.UPDATE_BRANCH; data: GitHubUpdateBranchOpResult };

/**
 * GitHubCreatePROpResult is a GitHub create PR op result.
 */
export type GitHubCreatePROpResult = GitHubAPIPullsPostResponse;

/**
 * GitHubUpdatePROpResult is a GitHub update PR op result.
 */
export type GitHubUpdatePROpResult = GitHubAPIPullPatchResponse;

/**
 * GitHubCreateOrUpdatePROpResult is a GitHub create or update PR op result.
 */
export type GitHubCreateOrUpdatePROpResult =
  | { type: GitHubOpType.CREATE_PR; data: GitHubCreatePROpResult }
  | { type: GitHubOpType.UPDATE_PR; data: GitHubUpdatePROpResult };

/**
 * GitHubOpResultOf is the result of a GitHubOp.
 */
export type GitHubOpResultOf<R, T extends GitHubOp<R>> = T extends
  GitHubCreateTreeOp<R> ? GitHubCreateTreeOpResult
  : T extends GitHubCreateCommitOp<R> ? GitHubCreateCommitOpResult
  : T extends GitHubCreateBranchOp<R> ? GitHubCreateBranchOpResult
  : T extends GitHubUpdateBranchOp<R> ? GitHubUpdateBranchOpResult
  : T extends GitHubCreateOrUpdateBranchOp<R>
    ? GitHubCreateOrUpdateBranchOpResult
  : T extends GitHubCreatePROp<R> ? GitHubCreatePROpResult
  : T extends GitHubUpdatePROp<R> ? GitHubUpdatePROpResult
  : T extends GitHubCreateOrUpdatePROp<R> ? GitHubCreateOrUpdatePROpResult
  : never;

/**
 * GitHubCreateTreeOp is a GitHub tree operation.
 */
export type GitHubCreateTreeOp<R> = {
  type: GitHubOpType.CREATE_TREE;
  data: GitHubAPITreesPostRequestGenerate<R>;
};

/**
 * GitHubCreateCommitOp is a GitHub commit operation.
 */
export type GitHubCreateCommitOp<R> = {
  type: GitHubOpType.CREATE_COMMIT;
  data: GitHubAPICommitsPostRequestGenerate<R>;
};

/**
 * GitHubCreateBranchOp is a GitHub branch operation.
 */
export type GitHubCreateBranchOp<R> = {
  type: GitHubOpType.CREATE_BRANCH;
  data: GitHubAPIRefsPostRequestGenerate<R>;
};

/**
 * GitHubUpdateBranchOp is a GitHub branch operation.
 */
export type GitHubUpdateBranchOp<R> = {
  type: GitHubOpType.UPDATE_BRANCH;
  data: GitHubAPIRefPatchRequestGenerate<R>;
};

/**
 * GitHubCreateOrUpdateBranchOp is a GitHub branch operation.
 */
export type GitHubCreateOrUpdateBranchOp<R> = {
  type: GitHubOpType.CREATE_OR_UPDATE_BRANCH;
  data: {
    create: GitHubAPIRefsPostRequestGenerate<R>;
    update: GitHubAPIRefPatchRequestGenerate<R>;
  };
};

/**
 * GitHubCreatePROp is a PR action.
 */
export type GitHubCreatePROp<R> = {
  type: GitHubOpType.CREATE_PR;
  data: GitHubAPIPullsPostRequestGenerate<R>;
};

/**
 * GitHubUpdatePROp is a PR action.
 */
export type GitHubUpdatePROp<R> = {
  type: GitHubOpType.UPDATE_PR;
  data: GitHubAPIPullPatchRequestGenerate<R>;
};

/**
 * GitHubCreateOrUpdatePROp is a PR action.
 */
export type GitHubCreateOrUpdatePROp<R> = {
  type: GitHubOpType.CREATE_OR_UPDATE_PR;
  data: {
    create: GitHubAPIPullsPostRequestGenerate<R>;
    update: GitHubAPIPullPatchRequestGenerate<R>;
  };
};

/**
 * GitHubOpType is a GitHub operation type.
 */
export enum GitHubOpType {
  CREATE_TREE = "createTree",
  CREATE_COMMIT = "createCommit",
  CREATE_BRANCH = "createBranch",
  UPDATE_BRANCH = "updateBranch",
  CREATE_OR_UPDATE_BRANCH = "createOrUpdateBranch",
  CREATE_PR = "createPR",
  UPDATE_PR = "updatePR",
  CREATE_OR_UPDATE_PR = "createOrUpdatePR",
}
