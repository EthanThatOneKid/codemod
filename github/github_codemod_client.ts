import type { GitHubAPIClientInterface } from "./api/mod.ts";
import type {
  GitHubBranch,
  GitHubBranchClientInterface,
  GitHubBranchClientOptions,
  GitHubCodemodClientInterface,
  GitHubCommit,
  GitHubCommitClientInterface,
  GitHubCommitClientOptions,
  GitHubPR,
  GitHubPRClientInterface,
  GitHubPRClientOptions,
  GitHubTree,
  GitHubTreeItem,
} from "./github_codemod_client_interface.ts";
import { fromBlob } from "./base64.ts";

/**
 * GitHubCodemodClient is a GitHub Codemod client.
 */
export class GitHubCodemodClient implements GitHubCodemodClientInterface {
  constructor(private readonly api: GitHubAPIClientInterface) {}

  public newCodemod(
    options: GitHubCommitClientOptions,
  ): Promise<GitHubCommitClientInterface> {
    return Promise.resolve(new GitHubCommitClient(this.api, options));
  }
}

/**
 * GitHubCommitClient is a GitHub commit client.
 */
export class GitHubCommitClient implements GitHubCommitClientInterface {
  private tree = new Map<string, GitHubCodemod>();

  constructor(
    private readonly api: GitHubAPIClientInterface,
    private readonly options: GitHubCommitClientOptions,
  ) {}

  public addFile(path: string, blob: Blob): void {
    this.tree.set(path, {
      type: GitHubCodemodType.ADD_FILE,
      blob,
    });
  }

  public addTextFile(path: string, content: string): void {
    this.tree.set(path, {
      type: GitHubCodemodType.ADD_TEXT_FILE,
      content,
    });
  }

  public deleteFile(path: string): void {
    this.tree.set(path, {
      type: GitHubCodemodType.DELETE_FILE,
    });
  }

  /**
   * doCodemod makes a GitHub tree item from a codemod, which potentially involves
   * making a new blob and/or reading an existing file from the repository.
   */
  private async doCodemod(
    path: string,
    codemod: GitHubCodemod,
  ): Promise<GitHubTreeItem> {
    switch (codemod.type) {
      case GitHubCodemodType.ADD_FILE: {
        const blob = await this.api.postReposOwnerRepoGitBlobs({
          content: await fromBlob(codemod.blob),
          encoding: "base64",
        });
        return {
          mode: "100644",
          path,
          sha: blob.sha,
          type: "blob",
        };
      }

      case GitHubCodemodType.ADD_TEXT_FILE: {
        const blob = await this.api.postReposOwnerRepoGitBlobs({
          content: codemod.content,
          encoding: "utf-8",
        });
        return {
          mode: "100644",
          path,
          sha: blob.sha,
          type: "blob",
        };
      }

      case GitHubCodemodType.DELETE_FILE: {
        return {
          mode: "100644",
          path,
          sha: null,
          type: "blob",
        };
      }
    }
  }

  public async newCommit(): Promise<GitHubCommit>;
  public async newCommit(
    options: GitHubBranchClientOptions,
  ): Promise<GitHubBranchClientInterface>;
  public async newCommit(
    options?: GitHubBranchClientOptions,
  ): Promise<GitHubCommit | GitHubBranchClientInterface> {
    const treeArray: GitHubTree = await Promise.all(
      Array.from(this.tree.entries()).map(([path, codemod]) =>
        this.doCodemod(path, codemod)
      ),
    );

    // Get the base branch.
    const baseBranch = this.options.parents?.at(0) ??
      (await this.api.getReposOwnerRepo()).default_branch;
    const branch = await this.api.getReposOwnerRepoBranchesBranch({
      branch: baseBranch,
    });

    // Get the base tree.
    const branchCommitSHA = branch.commit.sha;
    const branchTreeSHA = branch.commit.commit.tree.sha;
    const tree = await this.api.postReposOwnerRepoGitTrees({
      base_tree: branchTreeSHA,
      tree: treeArray,
    });

    // Make the commit.
    const commit = await this.api.postReposOwnerRepoGitCommits({
      ...this.options,
      tree: tree.sha,
      parents: [branchCommitSHA],
    });
    if (options) {
      return new GitHubBranchClient(this.api, {
        ...options,
        sha: commit.sha,
      });
    }

    return commit;
  }
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
 * GitHubBranchClient is a GitHub branch client.
 */
export class GitHubBranchClient implements GitHubBranchClientInterface {
  constructor(
    private readonly api: GitHubAPIClientInterface,
    private readonly options: GitHubBranchClientOptions,
  ) {}

  public async newBranch(): Promise<GitHubBranch>;
  public async newBranch(
    options: GitHubPRClientOptions,
  ): Promise<GitHubPRClientInterface>;
  public async newBranch(
    options?: GitHubPRClientOptions,
  ): Promise<GitHubBranch | GitHubPRClientInterface> {
    const branch = await this.api.postReposOwnerRepoGitRefs(this.options);
    if (options) {
      return new GitHubPRClient(this.api, options);
    }

    return branch;
  }

  public async updateBranch(): Promise<GitHubBranch>;
  public async updateBranch(
    options: GitHubPRClientOptions,
  ): Promise<GitHubPRClientInterface>;
  public async updateBranch(
    options?: GitHubPRClientOptions,
  ): Promise<GitHubBranch | GitHubPRClientInterface> {
    const branch = await this.api.patchReposOwnerRepoGitRefsRef(
      this.options,
    );
    if (options) {
      return new GitHubPRClient(this.api, options);
    }

    return branch;
  }
}

/**
 * GitHubPRClient is a GitHub pull request client.
 */
export class GitHubPRClient implements GitHubPRClientInterface {
  constructor(
    private readonly api: GitHubAPIClientInterface,
    private readonly options: GitHubPRClientOptions,
  ) {}

  public async newPR(): Promise<GitHubPR> {
    return await this.api.postReposOwnerRepoPulls(this.options);
  }
}
