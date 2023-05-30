import type { JSONPatchOperation } from "../../deps.ts";
import type { GitHubAPITreesPostRequest } from "../api/mod.ts";
import type { Generate } from "../shared/generate.ts";

/**
 * GitHubCreateTreeBuilderInterface is an interface for a
 * GitHubCreateTreeBuilder.
 *
 * @see https://docs.github.com/en/rest/reference/git#create-a-tree
 */
export interface GitHubCreateTreeBuilderInterface {
  /**
   * run executes the builder.
   */
  run(): Promise<GitHubAPITreesPostRequest>;

  /**
   * clear clears the tree.
   */
  clear(): this;

  /**
   * base sets the base tree SHA.
   *
   * Subsequent calls to base will override the previous base tree SHA.
   */
  base(shaOrSHAGenerate: Generate<string | undefined, []>): this;

  /**
   * ref sets the base tree SHA from a ref.
   *
   * This is a convenience method that overrides the base tree SHA.
   */
  ref(refOrRefGenerate: Generate<string, []>): this;

  /**
   * file sets a file blob.
   */
  file(
    path: string,
    blobOrBlobGenerate: Generate<Blob, [Blob]>,
  ): this;

  /**
   * text sets a text blob.
   *
   * @todo https://youtu.be/nwHqXtk6LHA
   */
  text(
    path: string,
    textOrTextGenerate: Generate<string, [string]>,
  ): this;

  /**
   * jsonPatch applies patches to a JSON file.
   */
  jsonPatch<T>(
    path: string,
    patchesOrPatchesGenerate: Generate<JSONPatchOperation[], [string]>,
    deserializeJSON: Generate<(content: string) => T, [string]>,
    serializeJSON: Generate<(value: T) => string, [string]>,
  ): this;

  /**
   * executable sets an executable blob.
   */
  executable(
    path: string,
    blobOrBlobGenerate: Generate<Blob, [Blob]>,
  ): this;

  /**
   * subdirectory sets a subdirectory tree.
   */
  subdirectory(
    path: string,
    shaOrSHAGenerate: Generate<string, []>,
  ): this;

  /**
   * submodules sets a submodule commit.
   */
  submodule(
    path: string,
    shaOrSHAGenerate: Generate<string, []>,
  ): this;

  /**
   * symlink sets a symlink blob.
   */
  symlink(
    path: string,
    blobOrBlobGenerate: Generate<Blob, [Blob]>,
  ): this;

  /**
   * rename renames a file.
   */
  rename(
    path: string,
    pathOrPathGenerate: Generate<string, [string]>,
  ): this;

  /**
   * delete deletes a file.
   */
  delete(path: string): this;
}

/**
 * GitHubTreeOpType is a type for a GitHub create tree operation type.
 */
export enum GitHubTreeOpType {
  FILE = "file",
  TEXT = "text",
  JSON_PATCH = "json_patch",
  EXECUTABLE = "executable",
  SUBDIRECTORY = "subdirectory",
  SUBMODULE = "submodule",
  SYMLINK = "symlink",
  RENAME = "rename",
  DELETE = "delete",
}

/**
 * GitHubTreeOp is a GitHub tree operation.
 */
export type GitHubTreeOp =
  | GitHubTreeFileOp
  | GitHubTreeTextOp
  | GitHubTreeJSONPatchOp
  | GitHubTreeExecutableOp
  | GitHubTreeSubdirectoryOp
  | GitHubTreeSubmoduleOp
  | GitHubTreeSymlinkOp
  | GitHubTreeRenameOp
  | GitHubTreeDeleteOp;

/**
 * GitHubTreeFileOp is a GitHub tree file operation.
 */
export interface GitHubTreeFileOp {
  type: GitHubTreeOpType.FILE;
  data: Generate<Blob, [Blob]>;
}

/**
 * GitHubTreeTextOp is a GitHub tree text operation.
 */
export interface GitHubTreeTextOp {
  type: GitHubTreeOpType.TEXT;
  data: Generate<string, [string]>;
}

/**
 * GitHubTreeJSONPatchOp is a GitHub tree JSON patch operation.
 */
export interface GitHubTreeJSONPatchOp {
  type: GitHubTreeOpType.JSON_PATCH;
  data: Generate<JSONPatchOperation[], [string]>;
  deserializeJSON: Generate<(content: string) => unknown, [string]>;
  serializeJSON: Generate<(value: unknown) => string, [string]>;
}

/**
 * GitHubTreeExecutableOp is a GitHub tree executable operation.
 */
export interface GitHubTreeExecutableOp {
  type: GitHubTreeOpType.EXECUTABLE;
  data: Generate<Blob, [Blob]>;
}

/**
 * GitHubTreeSubdirectoryOp is a GitHub tree subdirectory operation.
 */
export interface GitHubTreeSubdirectoryOp {
  type: GitHubTreeOpType.SUBDIRECTORY;
  data: Generate<string, []>;
}

/**
 * GitHubTreeSubmoduleOp is a GitHub tree submodule operation.
 */
export interface GitHubTreeSubmoduleOp {
  type: GitHubTreeOpType.SUBMODULE;
  data: Generate<string, []>;
}

/**
 * GitHubTreeSymlinkOp is a GitHub tree symlink operation.
 */
export interface GitHubTreeSymlinkOp {
  type: GitHubTreeOpType.SYMLINK;
  data: Generate<Blob, [Blob]>;
}

/**
 * GitHubTreeRenameOp is a GitHub tree rename operation.
 */
export interface GitHubTreeRenameOp {
  type: GitHubTreeOpType.RENAME;
  data: Generate<string, [string]>;
}

/**
 * GitHubTreeDeleteOp is a GitHub tree delete operation.
 */
export interface GitHubTreeDeleteOp {
  type: GitHubTreeOpType.DELETE;
}
