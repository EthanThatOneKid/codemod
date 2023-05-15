import type {
  GitHubAPIClientInterface,
  ReposOwnerRepoGitTreesPostRequest,
} from "../api/mod.ts";
import { GitHubCodemodType } from "./types.ts";
import type {
  GitHubCodemod,
  GitHubCodemods,
  GitHubCreateTreeOptions,
  GitHubTree,
  GitHubTreeItem,
  GitHubTreeResult,
} from "./types.ts";
import { fromBlob } from "./base64.ts";

/**
 * createTree creates a GitHub tree.
 */
export async function createTree(
  api: GitHubAPIClientInterface,
  createTreeOptions: GitHubCreateTreeOptions,
): Promise<GitHubTreeResult> {
  const request = await fromOptions(api, createTreeOptions);
  const response = await api.postReposOwnerRepoGitTrees(request);
  return { tree: response };
}

/**
 * fromOptions converts GitHubCreateTreeOptions into the GitHub API tree request.
 */
export async function fromOptions(
  api: GitHubAPIClientInterface,
  options: GitHubCreateTreeOptions,
): Promise<ReposOwnerRepoGitTreesPostRequest> {
  const { 0: baseTreeSHA, 1: tree } = await Promise.all([
    getBaseTreeSHA(api, options.baseBranchName),
    uploadTree(api, options.codemods),
  ]);
  return { base_tree: baseTreeSHA, tree };
}

async function getBaseTreeSHA(
  api: GitHubAPIClientInterface,
  baseBranchName?: string,
): Promise<string> {
  baseBranchName ??= (await api.getReposOwnerRepo()).default_branch;
  return (await api.getReposOwnerRepoBranchesBranch({
    branch: baseBranchName,
  })).commit.commit.tree.sha;
}

/**
 * uploadTree makes a GitHub tree from the codemod tree.
 */
export async function uploadTree(
  api: GitHubAPIClientInterface,
  codemods: GitHubCodemods,
): Promise<GitHubTree> {
  return await Promise.all(
    Object.entries(codemods).map(([path, codemod]) =>
      uploadTreeItem(api, path, codemod)
    ),
  );
}

/**
 * uploadTreeItem makes a GitHub tree item from a codemod, which potentially involves
 * making a new blob and/or reading an existing file from the repository.
 */
export async function uploadTreeItem(
  api: GitHubAPIClientInterface,
  path: string,
  codemod: GitHubCodemod,
): Promise<GitHubTreeItem> {
  switch (codemod.type) {
    case GitHubCodemodType.ADD_FILE: {
      const blob = await api.postReposOwnerRepoGitBlobs({
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
      const blob = await api.postReposOwnerRepoGitBlobs({
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
