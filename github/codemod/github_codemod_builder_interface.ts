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
import type { GitHubCreateTreeBuilderInterface } from "../tree/github_create_tree_builder_interface.ts";
import type { Generate } from "../shared/generate.ts";
import type { Append } from "../shared/append.ts";

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
   * createTree adds a create GiHub tree action to the builder.
   */
  createTree(
    optionsOrOptionsGenerate: GitHubTreeOp<R>["options"],
    builderOrBuilderGenerate?: GitHubTreeOp<R>["builder"],
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPITreesPostResponse]>
  >;

  /**
   * createCommit adds a create GiHub commit action to the builder.
   */
  createCommit(
    optionsOrOptionsGenerate: GitHubTreeOp<R>["options"],
    builderOrBuilderGenerate?: GitHubTreeOp<R>["builder"],
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPICommitsPostResponse]>
  >;

  /**
   * createBranch adds a create GiHub branch action to the builder.
   */
  createBranch(
    optionsOrOptionsGenerate: GitHubTreeOp<R>["options"],
    builderOrBuilderGenerate?: GitHubTreeOp<R>["builder"],
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIRefsPostResponse]>
  >;

  /**
   * updateBranch adds a update GiHub branch action to the builder.
   */
  updateBranch(
    optionsOrOptionsGenerate: GitHubTreeOp<R>["options"],
    builderOrBuilderGenerate?: GitHubTreeOp<R>["builder"],
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIRefPatchResponse]>
  >;

  /**
   * createOrUpdateBranch adds a create or update GiHub branch action to the builder.
   */
  createOrUpdateBranch(
    optionsOrOptionsGenerate: GitHubTreeOp<R>["options"],
    builderOrBuilderGenerate?: GitHubTreeOp<R>["builder"],
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIRefPatchResponse]>
  >;

  // TODO: Add deleteBranch.

  /**
   * createPR adds a create GiHub PR action to the builder.
   */
  createPR(
    optionsOrOptionsGenerate: GitHubTreeOp<R>["options"],
    builderOrBuilderGenerate?: GitHubTreeOp<R>["builder"],
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIPullsPostResponse]>
  >;

  /**
   * updatePR adds a update GiHub PR action to the builder.
   */
  updatePR(
    optionsOrOptionsGenerate: GitHubPROp<R>["options"],
    builderOrBuilderGenerate?: GitHubTreeOp<R>["builder"],
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIPullPatchResponse]>
  >;

  /**
   * createOrUpdatePR adds a create or update GiHub PR action to the builder.
   */
  createOrUpdatePR(
    optionsOrOptionsGenerate: GitHubTreeOp<R>["options"],
    builderOrBuilderGenerate?: GitHubTreeOp<R>["builder"],
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIPullPatchResponse]>
  >;

  // TODO: Add deletePR.
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
 * GitHubTreeOp is a GitHub tree operation.
 */
export type GitHubTreeOp<R> = {
  type: GitHubOpType.CREATE_TREE;
  options: GitHubAPITreesPostRequestGenerate<R>;
  builder: Generate<
    GitHubCreateTreeBuilderInterface,
    [GitHubCreateTreeBuilderInterface, R]
  >;
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
