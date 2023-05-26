import {
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
} from "./api/mod.ts";

/**
 * GitHubCodemodBuilderInterface is a protocol for building and executing a
 * sequence of GitHub operations.
 */
export interface GitHubCodemodBuilderInterface<
  /**
   * M is the map result type.
   */
  M = never,
  /**
   * R is the result type. By default, it is an empty tuple. As the instructions
   * are added, the result type is appended with the result of the instruction.
   */
  R extends Array<GitHubOpResult<M>> = [],
> {
  /**
   * run executes the builder.
   */
  run(): Promise<R>;

  /**
   * clone clones the builder as a new instance.
   */
  clone(): GitHubCodemodBuilderInterface<M, R>;

  /**
   * map maps the result of the builder.
   */
  map(
    optionsOrOptionsGenerate: GitHubMapOpGenerate<M, R>,
  ): GitHubCodemodBuilderInterface<M, Append<R, [M]>>;

  /**
   * createTree adds a create GiHub tree action to the builder.
   */
  createTree(
    optionsOrOptionsGenerate: GitHubAPITreesPostRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPITreesPostResponse]>
  >;

  /**
   * createCommit adds a create GiHub commit action to the builder.
   */
  createCommit(
    optionsOrOptionsGenerate: GitHubAPICommitsPostRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPICommitsPostResponse]>
  >;

  /**
   * createBranch adds a create GiHub branch action to the builder.
   */
  createBranch(
    optionsOrOptionsGenerate: GitHubAPIRefsPostRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPIRefsPostResponse]>
  >;

  /**
   * updateBranch adds a update GiHub branch action to the builder.
   */
  updateBranch(
    optionsOrOptionsGenerate: GitHubAPIRefPatchRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPIRefPatchResponse]>
  >;

  /**
   * createOrUpdateBranch adds a create or update GiHub branch action to the builder.
   */
  createOrUpdateBranch(
    optionsOrOptionsGenerate: GitHubAPIRefPatchRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPIRefPatchResponse]>
  >;

  // TODO: Add deleteBranch.

  /**
   * createPR adds a create GiHub PR action to the builder.
   */
  createPR(
    optionsOrOptionsGenerate: GitHubAPIPullsPostRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPIPullsPostResponse]>
  >;

  /**
   * updatePR adds a update GiHub PR action to the builder.
   */
  updatePR(
    optionsOrOptionsGenerate: GitHubAPIPullPatchRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPIPullPatchResponse]>
  >;

  /**
   * createOrUpdatePR adds a create or update GiHub PR action to the builder.
   */
  createOrUpdatePR(
    optionsOrOptionsGenerate: GitHubAPIPullPatchRequest,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPIPullPatchResponse]>
  >;

  // TODO: Add deletePR.
}

/**
 * GitHubMapOpGenerate is a function executed as a map operation.
 */
export type GitHubMapOpGenerate<M, R> = Generate<M, R>;

/**
 * GitHubAPITreesPostRequestGenerate is a function to generate a GitHubAPITreesPostRequest.
 */
export type GitHubAPITreesPostRequestGenerate<T> = Generate<
  GitHubAPITreesPostRequest,
  T
>;

/**
 * GitHubAPICommitsPostRequestGenerate is a function to generate a GitHubAPICommitsPostRequest.
 */
export type GitHubAPICommitsPostRequestGenerate<T> = Generate<
  GitHubAPICommitsPostRequest,
  T
>;

/**
 * GitHubAPIRefsPostRequestGenerate is a function to generate a GitHubAPIRefsPostRequest.
 */
export type GitHubAPIRefsPostRequestGenerate<T> = Generate<
  GitHubAPIRefsPostRequest,
  T
>;

/**
 * GitHubAPIRefPatchRequestGenerate is a function to generate a GitHubAPIRefPatchRequest.
 */
export type GitHubAPIRefPatchRequestGenerate<T> = Generate<
  GitHubAPIRefPatchRequest,
  T
>;

/**
 * GitHubAPIPullsPostRequestGenerate is a function to generate a GitHubAPIPullsPostRequest.
 */
export type GitHubAPIPullsPostRequestGenerate<T> = Generate<
  GitHubAPIPullsPostRequest,
  T
>;

/**
 * GitHubAPIPullPatchRequestGenerate is a function to generate a GitHubAPIPullsPullNumberPatchRequest.
 */
export type GitHubAPIPullPatchRequestGenerate<T> = Generate<
  GitHubAPIPullPatchRequest,
  T
>;

/**
 * GitHubOp is a GitHub operation.
 */
export type GitHubOp<R, M> =
  | GitHubMapOp<R, M>
  | GitHubTreeOp<R>
  | GitHubCommitOp<R>
  | GitHubBranchOp<R>
  | GitHubPROp<R>;

/**
 * GitHubOpResult is a GitHub op result.
 */
export type GitHubOpResult<M> =
  | M
  | GitHubAPITreesPostResponse
  | GitHubAPICommitsPostResponse
  | GitHubAPIRefsPostResponse
  | GitHubAPIRefPatchResponse
  | GitHubAPIPullsPostResponse
  | GitHubAPIPullPatchResponse;

/**
 * GitHubMapOp is a map action.
 */
export type GitHubMapOp<R, M> = {
  type: GitHubOpType.MAP;
  data: GitHubMapOpGenerate<M, R>;
};

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
 *
 * MAP is a special op type to map the result of the previous
 * operation to the next one.
 */
export enum GitHubOpType {
  MAP = "map",
  CREATE_TREE = "createTree",
  CREATE_COMMIT = "createCommit",
  CREATE_BRANCH = "createBranch",
  UPDATE_BRANCH = "updateBranch",
  CREATE_OR_UPDATE_BRANCH = "createOrUpdateBranch",
  CREATE_PR = "createPR",
  UPDATE_PR = "updatePR",
  CREATE_OR_UPDATE_PR = "createOrUpdatePR",
}

/**
 * Append appends a tuple to another tuple.
 *
 * @see
 * https://stackoverflow.com/questions/53985074/typescript-how-to-add-an-item-to-a-tuple#comment118209932_62561508
 */
export type Append<I extends unknown[], T extends unknown[]> = [...T, ...I];

/**
 * Generate is a helper type to generate a type from a type or a function.
 */
export type Generate<T, U> =
  | T
  | (() => T)
  | (() => Promise<T>)
  | ((input: U) => T)
  | ((input: U) => Promise<T>);
