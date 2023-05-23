import type {
  GitHubAPIBranchGetResponse,
  GitHubAPITreesPostRequest,
  GitHubAPITreesPostResponse,
} from "../api/mod.ts";

/**
 * GitHubTreeResult is the result of creating a commit.
 */
export interface GitHubTreeResult<T> {
  data?: T;
  defaultBranchName?: string;
  baseBranch: GitHubAPIBranchGetResponse;
  tree: GitHubAPITreesPostResponse;
}

/**
 * GitHubCreateTreeOptionsGenerate is the function type for generating a tree.
 */
export type GitHubCreateTreeOptionsGenerate<T> = (
  result: GitHubTreeResult<T>,
) => GitHubCreateTreeOptions<T>;

/**
 * GitHubCreateTreeOptions are the options to create a tree.
 */
export interface GitHubCreateTreeOptions<T> {
  codemods: GitHubCodemods<T>;
  baseBranchName?: string; // Used like "refs/heads/{name}". If not provided, the default branch is used.
}

/**
 * GitHubCodemods is a map of file paths to file mods.
 */
export interface GitHubCodemods<T> {
  [path: string]: GitHubCodemod<T>;
}

/**
 * GitHubCodemod is a file modification. It can be a new file or a deletion.
 *
 * The file mods are stored in a map where they will wait to be executed.
 */
export type GitHubCodemod<T> =
  | GitHubCodemodSetBlob
  | GitHubCodemodSetText
  | GitHubCodemodEditBlob<T>
  | GitHubCodemodEditText<T>
  | GitHubCodemodDelete;

/**
 * GitHubCodemodType is the type of a GitHub codemod.
 *
 * Note:
 * The file mode; one of 100644 for file (blob), 100755 for executable (blob),
 * 040000 for subdirectory (tree), 160000 for submodule (commit), or 120000
 * for a blob that specifies the path of a symlink. Can be one of:
 * 100644, 100755, 040000, 160000, 120000.
 *
 * See:
 * https://developer.github.com/v3/git/trees/#create-a-tree
 *
 * TODO(EthanThatOneKid):
 * Support SET_DIRECTORY, SET_SYMLINK, EDIT_DIRECTORY, EDIT_SYMLINK.
 */
export enum GitHubCodemodType {
  SET_BLOB = "set_blob",
  SET_TEXT = "set_text",
  EDIT_BLOB = "edit_blob",
  EDIT_TEXT = "edit_text",
  DELETE = "delete",
}

/**
 * GitHubCodemodSetBlob contains a blob which is associated with a path.
 */
export interface GitHubCodemodSetBlob {
  type: GitHubCodemodType.SET_BLOB;
  blob: Blob;
}

/**
 * GitHubCodemodSetText contains a string which is associated with a path.
 */
export interface GitHubCodemodSetText {
  type: GitHubCodemodType.SET_TEXT;
  content: string;
}

/**
 * GitHubCodemodEditBlob contains a function which edits a blob.
 */
export interface GitHubCodemodEditBlob<T> {
  type: GitHubCodemodType.EDIT_BLOB;
  fn: GitHubCodemodEditBlobGenerate<T>;
}

/**
 * GitHubCodemodEditBlobGenerate is the function type for generating a blob.
 */
export type GitHubCodemodEditBlobGenerate<T> = (
  blob: Blob,
) => Blob | Promise<Blob> | [Blob, T] | Promise<[Blob, T]>;

/**
 * GitHubCodemodEditText contains a function which edits a string.
 */
export interface GitHubCodemodEditText<T> {
  type: GitHubCodemodType.EDIT_TEXT;
  fn: GitHubCodemodEditTextGenerate<T>;
}

/**
 * GitHubCodemodEditTextGenerate is the function type for generating a string.
 */
export type GitHubCodemodEditTextGenerate<T> = (
  content: string,
) => string | Promise<string> | [string, T] | Promise<[string, T]>;

/**
 * GitHubCodemodDeleteFile indicates that a file should be deleted.
 */
export interface GitHubCodemodDelete {
  type: GitHubCodemodType.DELETE;
}

/**
 * GitHubTreeItem is a single node in a GitHub tree.
 */
export type GitHubTreeItem = GitHubTree[number];

/**
 * GitHubTree is a GitHub tree.
 */
export type GitHubTree = GitHubAPITreesPostRequest["tree"];
