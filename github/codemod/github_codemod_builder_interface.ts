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
import { GitHubCreateTreeBuilder } from "../tree/github_create_tree_builder.ts";
import { GitHubCreateCommitBuilder } from "../commit/github_create_commit_builder.ts";

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
    Append<R, [GitHubOpResultOf<GitHubOp<R>, R>]>
  >;

  /**
   * createTree adds a create GiHub tree action to the builder.
   */
  createTree(
    builderOrBuilderGenerate: Generate<
      GitHubCreateTreeBuilder,
      [GitHubCreateTreeBuilder, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPITreesPostResponse]>
  >;

  /**
   * createCommit adds a create GiHub commit action to the builder.
   */
  createCommit(
    builderOrBuilderGenerate: Generate<
      GitHubCreateCommitBuilder,
      [GitHubCreateCommitBuilder, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPICommitsPostResponse]>
  >;

  /**
   * createBranch adds a create GiHub branch action to the builder.
   */
  createBranch(
    builderOrBuilderGenerate: Generate<
      GitHubCreateBranchBuilder,
      [GitHubCreateBranchBuilder, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIRefsPostResponse]>
  >;

  /**
   * updateBranch adds a update GiHub branch action to the builder.
   */
  updateBranch(
    builderOrBuilderGenerate: Generate<
      GitHubUpdateBranchBuilder,
      [GitHubUpdateBranchBuilder, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIRefPatchResponse]>
  >;

  /**
   * createOrUpdateBranch adds a create or update GiHub branch action to the builder.
   */
  createOrUpdateBranch(
    builderOrBuilderGenerate: Generate<
      GitHubCreateOrUpdateBranchBuilder,
      [GitHubCreateOrUpdateBranchBuilder, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIRefPatchResponse]>
  >;

  /**
   * createPR adds a create GiHub PR action to the builder.
   */
  createPR(
    builderOrBuilderGenerate: Generate<
      GitHubCreatePRBuilder,
      [GitHubCreatePRBuilder, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIPullsPostResponse]>
  >;

  /**
   * updatePR adds a update GiHub PR action to the builder.
   */
  updatePR(
    builderOrBuilderGenerate: Generate<
      GitHubUpdatePRBuilder,
      [GitHubUpdatePRBuilder, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIPullPatchResponse]>
  >;

  /**
   * createOrUpdatePR adds a create or update GiHub PR action to the builder.
   */
  createOrUpdatePR(
    builderOrBuilderGenerate: Generate<
      GitHubCreateOrUpdatePRBuilder,
      [GitHubCreateOrUpdatePRBuilder, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIPullPatchResponse]>
  >;
}

/**
 * GitHubAPITreesPostRequestGenerate is a function to generate a GitHubAPITreesPostRequest.
 */
export type GitHubAPITreesPostRequestGenerate<T> = Generate<
  GitHubAPITreesPostRequest | undefined,
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
export type GitHubOpResultOf<T extends GitHubOp<R>, R> = T extends
  GitHubTreeOp<R> ? GitHubAPITreesPostResponse
  : T extends GitHubCommitOp<R> ? GitHubAPICommitsPostResponse
  : T extends GitHubBranchOp<R>
    ? GitHubAPIRefsPostResponse | GitHubAPIRefPatchResponse
  : T extends GitHubPROp<R>
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
  }
  | {
    type: GitHubOpType.CREATE_OR_UPDATE_BRANCH;
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
  }
  | {
    type: GitHubOpType.CREATE_OR_UPDATE_PR;
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
  CREATE_OR_UPDATE_BRANCH = "createOrUpdateBranch",
  CREATE_PR = "createPR",
  UPDATE_PR = "updatePR",
  CREATE_OR_UPDATE_PR = "createOrUpdatePR",
}
