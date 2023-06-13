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
   * baseRef sets the base reference for a branch.
   *
   * The `baseRef` function allows for setting the base reference of a branch
   * in a software development context. By calling this function, subsequent
   * calls can override the previous value set for the base reference. The
   * function takes two parameters:
   * - `refOrRefGenerate` (optional): This parameter accepts a generator
   *   function that returns a candidate branch name or reference. The
   *   return type of this function can be a string, undefined, or null.
   * - `fallbackRefs` (optional): An array of generator functions that return
   *   candidate branch names or references. The return type for each generator
   *   function can be a string or undefined.
   *
   * The expected return types convey specific meanings:
   * - If the return type is a string, it indicates a valid candidate branch
   *   name or reference to be used.
   * - If the return type is undefined, it suggests using a fallback reference
   *   or the default branch.
   * - If the return type is null, it signifies the creation of a completely
   *   empty new branch.
   *
   * Overall, the `baseRef` function serves the purpose of specifying and
   * overriding the base reference for a branch, with different return types
   * conveying different actions related to branch handling.
   */
  baseRef(
    refOrRefGenerate?: Generate<string | undefined | null, []>,
    ...fallbackRefs: Generate<string | undefined, []>[]
  ): this;

  /**
   * file sets a file blob.
   */
  file(
    path: string,
    blobOrBlobGenerate: Generate<Blob, [Blob]>,
  ): this;

  /**
   * text sets a text blob.
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
    deserializeJSON?: (content: string) => T,
    serializeJSON?: (value: T) => string,
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
  rename(oldPath: string, newPath: string): this;

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
  data: {
    patches: Generate<JSONPatchOperation[], [string]>;
    deserializeJSON: (content: string) => unknown;
    serializeJSON: (value: unknown) => string;
  };
}

/**
 * GitHubTreeExecutableOp is a GitHub tree executable operation.
 */
export interface GitHubTreeExecutableOp {
  type: GitHubTreeOpType.EXECUTABLE;
  data: Generate<Blob, []>;
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
  data: Generate<Blob, []>;
}

/**
 * GitHubTreeRenameOp is a GitHub tree rename operation.
 */
export interface GitHubTreeRenameOp {
  type: GitHubTreeOpType.RENAME;
  data: string;
}

/**
 * GitHubTreeDeleteOp is a GitHub tree delete operation.
 */
export interface GitHubTreeDeleteOp {
  type: GitHubTreeOpType.DELETE;
}
