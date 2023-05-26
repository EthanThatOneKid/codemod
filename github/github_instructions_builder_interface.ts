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
 * GitHubInstructionsBuilderInterface is a protocol for building and executing
 * a sequence of GitHub instructions.
 */
export interface GitHubInstructionsBuilderInterface<
  /**
   * M is the map result type.
   */
  M = never,
  /**
   * R is the result type. By default, it is an empty tuple. As the instructions
   * are added, the result type is appended with the result of the instruction.
   */
  R extends Array<GitHubInstructionResult<M>> = [],
> {
  /**
   * execute executes the builder.
   */
  execute(): Promise<R>;

  /**
   * clone clones the builder as a new instance.
   */
  clone(): GitHubInstructionsBuilderInterface<M, R>;

  /**
   * map maps the result of the builder.
   */
  map(
    optionsOrOptionsGenerate: GitHubMapInstructionGenerate<M, R>,
  ): GitHubInstructionsBuilderInterface<M, Append<R, [M]>>;

  /**
   * createTree adds a create GiHub tree action to the builder.
   */
  createTree(
    optionsOrOptionsGenerate: GitHubAPITreesPostRequestGenerate<R>,
  ): GitHubInstructionsBuilderInterface<
    M,
    Append<R, [GitHubAPITreesPostResponse]>
  >;

  /**
   * createCommit adds a create GiHub commit action to the builder.
   */
  createCommit(
    optionsOrOptionsGenerate: GitHubAPICommitsPostRequestGenerate<R>,
  ): GitHubInstructionsBuilderInterface<
    M,
    Append<R, [GitHubAPICommitsPostResponse]>
  >;

  /**
   * createBranch adds a create GiHub branch action to the builder.
   */
  createBranch(
    optionsOrOptionsGenerate: GitHubAPIRefsPostRequestGenerate<R>,
  ): GitHubInstructionsBuilderInterface<
    M,
    Append<R, [GitHubAPIRefsPostResponse]>
  >;

  /**
   * updateBranch adds a update GiHub branch action to the builder.
   */
  updateBranch(
    optionsOrOptionsGenerate: GitHubAPIRefPatchRequestGenerate<R>,
  ): GitHubInstructionsBuilderInterface<
    M,
    Append<R, [GitHubAPIRefPatchResponse]>
  >;

  /**
   * createOrUpdateBranch adds a create or update GiHub branch action to the builder.
   */
  createOrUpdateBranch(
    optionsOrOptionsGenerate: GitHubAPIRefPatchRequestGenerate<R>,
  ): GitHubInstructionsBuilderInterface<
    M,
    Append<R, [GitHubAPIRefPatchResponse]>
  >;

  /**
   * createPR adds a create GiHub PR action to the builder.
   */
  createPR(
    optionsOrOptionsGenerate: GitHubAPIPullsPostRequestGenerate<R>,
  ): GitHubInstructionsBuilderInterface<
    M,
    Append<R, [GitHubAPIPullsPostResponse]>
  >;

  /**
   * updatePR adds a update GiHub PR action to the builder.
   */
  updatePR(
    optionsOrOptionsGenerate: GitHubAPIPullPatchRequestGenerate<R>,
  ): GitHubInstructionsBuilderInterface<
    M,
    Append<R, [GitHubAPIPullPatchResponse]>
  >;

  /**
   * createOrUpdatePR adds a create or update GiHub PR action to the builder.
   */
  createOrUpdatePR(
    optionsOrOptionsGenerate: GitHubAPIPullPatchRequest,
  ): GitHubInstructionsBuilderInterface<
    M,
    Append<R, [GitHubAPIPullPatchResponse]>
  >;
}

/**
 * GitHubMapInstructionGenerate is a function to generate a GitHubMapInstruction.
 */
export type GitHubMapInstructionGenerate<M, R> = Generate<M, R>;

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
 * GitHubInstruction is a GitHub instruction.
 */
export type GitHubInstruction<R, M> =
  | GitHubMapInstruction<R, M>
  | GitHubTreeInstruction<R>
  | GitHubCommitInstruction<R>
  | GitHubBranchInstruction<R>
  | GitHubPRInstruction<R>;

/**
 * GitHubInstructionResult is a GitHub instruction result.
 */
export type GitHubInstructionResult<M> =
  | M
  | GitHubAPITreesPostResponse
  | GitHubAPICommitsPostResponse
  | GitHubAPIRefsPostResponse
  | GitHubAPIRefPatchResponse
  | GitHubAPIPullsPostResponse
  | GitHubAPIPullPatchResponse;

/**
 * GitHubMapInstruction is a map action.
 */
export type GitHubMapInstruction<R, M> = {
  type: GitHubInstructionType.MAP;
  data: GitHubMapInstructionGenerate<M, R>;
};

/**
 * GitHubTreeInstruction is a tree action.
 */
export type GitHubTreeInstruction<R> = {
  type: GitHubInstructionType.CREATE_TREE;
  data: GitHubAPITreesPostRequestGenerate<R>;
};

/**
 * GitHubCommitInstruction is a commit action.
 */
export type GitHubCommitInstruction<R> = {
  type: GitHubInstructionType.CREATE_COMMIT;
  data: GitHubAPICommitsPostRequestGenerate<R>;
};

/**
 * GitHubBranchInstruction is a branch action.
 */
export type GitHubBranchInstruction<R> =
  | {
    type: GitHubInstructionType.CREATE_BRANCH;
    data: GitHubAPIRefsPostRequestGenerate<R>;
  }
  | {
    type: GitHubInstructionType.UPDATE_BRANCH;
    data: GitHubAPIRefPatchRequestGenerate<R>;
  }
  | {
    type: GitHubInstructionType.CREATE_OR_UPDATE_BRANCH;
    data: GitHubAPIRefPatchRequestGenerate<R>;
  };

/**
 * GitHubPRInstruction is a PR action.
 */
export type GitHubPRInstruction<R> =
  | {
    type: GitHubInstructionType.CREATE_PR;
    data: GitHubAPIPullsPostRequestGenerate<R>;
  }
  | {
    type: GitHubInstructionType.UPDATE_PR;
    data: GitHubAPIPullPatchRequestGenerate<R>;
  }
  | {
    type: GitHubInstructionType.CREATE_OR_UPDATE_PR;
    data: GitHubAPIPullPatchRequestGenerate<R>;
  };

/**
 * GitHubInstructionType is a GitHub instruction type.
 */
export enum GitHubInstructionType {
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
type Append<I extends unknown[], T extends unknown[]> = [...T, ...I];

/**
 * Generate is a helper type to generate a type from a type or a function.
 */
export type Generate<T, U> =
  | T
  | (() => T)
  | (() => Promise<T>)
  | ((input: U) => T)
  | ((input: U) => Promise<T>);
