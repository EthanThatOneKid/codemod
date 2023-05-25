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
import { GitHubAPITreesPostRequest } from "./api/mod.ts";
import {
  GitHubAPICommitsPostRequest,
  GitHubAPIRefPatchRequest,
  GitHubAPIRefsPostRequest,
} from "./api/github_api_client_interface.ts";

/**
 * GitHubCodemodBuilderInterface is a protocol for building a GitHub codemod.
 */
export interface GitHubCodemodBuilderInterface {
  /**
   * clone clones the builder as a new instance.
   */
  clone(): GitHubCodemodBuilderInterface;

  /**
   * treeOp adds a tree action to the builder.
   */
  treeOp(action: GitHubTreeOp): this;

  /**
   * commitOp adds a commit action to the builder.
   */
  commitOp(action: GitHubCommitOp): this;

  /**
   * branchOp adds a branch action to the builder.
   */
  branchOp(action: GitHubBranchOp): this;

  /**
   * prOp adds a PR action to the builder.
   */
  prOp(action: GitHubPROp): this;
}

/**
 * GitHubTreeOp is a tree action.
 */
export type GitHubTreeOp = {
  type: GitHubTreeOpType.CREATE;
  data: GitHubAPITreesPostRequest;
};

/**
 * GitHubTreeOpType is a tree action type.
 */
export enum GitHubTreeOpType {
  CREATE = "create",
}

/**
 * GitHubCommitOp is a commit action.
 */
export type GitHubCommitOp = {
  type: GitHubCommitOpType.CREATE;
  data: GitHubAPICommitsPostRequest;
};

/**
 * GitHubCommitOpType is a commit action type.
 */
export enum GitHubCommitOpType {
  CREATE = "create",
}

/**
 * GitHubBranchOp is a branch action.
 */
export type GitHubBranchOp =
  | {
    type: GitHubBranchOpType.CREATE;
    data: GitHubAPIRefsPostRequest;
  }
  | {
    type: GitHubBranchOpType.UPDATE;
    data: GitHubAPIRefPatchRequest;
  }
  | {
    type: GitHubBranchOpType.CREATE_OR_UPDATE;
    data: GitHubAPIRefPatchRequest;
  };

/**
 * GitHubBranchOpType is a branch action type.
 */
export enum GitHubBranchOpType {
  CREATE = "create",
  UPDATE = "update",
  CREATE_OR_UPDATE = "create_or_update",
}
