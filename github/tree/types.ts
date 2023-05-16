import type {
  ReposOwnerRepoBranchesBranchGetResponse,
  ReposOwnerRepoGitTreesPostRequest,
  ReposOwnerRepoGitTreesPostResponse,
} from "../api/mod.ts";

/**
 * GitHubTreeResult is the result of creating a commit.
 */
export interface GitHubTreeResult {
  tree: ReposOwnerRepoGitTreesPostResponse;
  baseBranch: ReposOwnerRepoBranchesBranchGetResponse;
}

/**
 * GitHubCreateTreeOptions are the options to create a tree.
 */
export interface GitHubCreateTreeOptions {
  codemods: GitHubCodemods;
  baseBranchName?: string; // Used like "refs/heads/{name}". If not provided, the default branch is used.
}

/**
 * GitHubCodemods is a map of file paths to file mods.
 */
export interface GitHubCodemods {
  [path: string]: GitHubCodemod;
}

/**
 * GitHubCodemod is a file modification. It can be a new file or a deletion.
 *
 * The file mods are stored in a map where they will wait to be executed.
 */
export type GitHubCodemod =
  | GitHubCodemodAddFile
  | GitHubCodemodAddTextFile
  | GitHubCodemodDeleteFile;

/**
 * GitHubCodemodType is the type of a GitHub codemod.
 *
 * TODO(EthanThatOneKid):
 * Support ADD_DIRECTORY, ADD_SYMLINK, DELETE_DIRECTORY, DELETE_SYMLINK.
 * Support EDIT_FILE, EDIT_TEXT_FILE, EDIT_DIRECTORY, EDIT_SYMLINK.
 *
 * See:
 * https://developer.github.com/v3/git/trees/#create-a-tree
 * https://github.com/acmcsufoss/codemod/commit/31ceff666b72b18bb1aaea74ff7ae8261033fdfb#diff-78a9fb49c670b37c956cecd83e26b1fdda5090b8081e5079006641b8e0089f43R54
 *
 * Note:
 * The file mode; one of 100644 for file (blob), 100755 for executable (blob), 040000 for subdirectory (tree), 160000 for submodule (commit), or 120000 for a blob that specifies the path of a symlink. Can be one of: 100644, 100755, 040000, 160000, 120000
 */
export enum GitHubCodemodType {
  ADD_FILE,
  ADD_TEXT_FILE,
  DELETE_FILE,
}

/**
 * GitHubCodemodAddFile contains a blob which is associated with a path.
 */
export interface GitHubCodemodAddFile {
  type: GitHubCodemodType.ADD_FILE;
  blob: Blob;
}

/**
 * GitHubCodemodAddTextFile contains a string which is associated with a path.
 */
export interface GitHubCodemodAddTextFile {
  type: GitHubCodemodType.ADD_TEXT_FILE;
  content: string;
}

/**
 * GitHubCodemodDeleteFile indicates that a file should be deleted.
 */
export interface GitHubCodemodDeleteFile {
  type: GitHubCodemodType.DELETE_FILE;
}

/**
 * GitHubTreeItem is a single node in a GitHub tree.
 */
export type GitHubTreeItem = GitHubTree[number];

/**
 * GitHubTree is a GitHub tree.
 */
export type GitHubTree = ReposOwnerRepoGitTreesPostRequest["tree"];
