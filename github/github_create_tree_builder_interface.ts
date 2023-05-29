import type { JSONPatchOperation } from "../deps.ts";
import type { GitHubAPITreesPostRequest } from "./api/mod.ts";
import type { Generate } from "./types.ts";

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
   * clone clones the builder.
   */
  clone(): this;

  /**
   * clear clears the tree.
   */
  clear(): this;

  /**
   * base sets the base tree SHA.
   */
  base(shaOrSHAGenerate: Generate<string, []>): this;

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
