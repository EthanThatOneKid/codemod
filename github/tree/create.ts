import type {
  GitHubAPIBranchGetResponse,
  GitHubAPIClientInterface,
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
import { stringFromBlob } from "./base64.ts";

/**
 * createTree creates a GitHub tree.
 */
export async function createTree(
  api: GitHubAPIClientInterface,
  options: GitHubCreateTreeOptions,
): Promise<GitHubTreeResult> {
  const baseBranch = await getBranch(api, options.baseBranchName);
  const tree = await uploadCodemodsAsTree(api, options.codemods);
  const response = await api.postTrees({
    base_tree: baseBranch.commit.commit.tree.sha,
    tree,
  });
  return {
    baseBranch,
    tree: response,
  };
}

/**
 * getBranch gets the base tree SHA from the base branch name.
 */
export async function getBranch(
  api: GitHubAPIClientInterface,
  branchName?: string,
): Promise<GitHubAPIBranchGetResponse> {
  branchName ??= (await api.getRepository()).default_branch;
  return await api.getBranch({
    branch: `refs/heads/${branchName}`,
  });
}

/**
 * uploadCodemodsAsTree makes a GitHub tree from the codemod tree.
 */
export async function uploadCodemodsAsTree(
  api: GitHubAPIClientInterface,
  codemods: GitHubCodemods,
): Promise<GitHubTree> {
  return await Promise.all(
    Object.entries(codemods).map(([path, codemod]) =>
      uploadCodemodAsTreeItem(api, path, codemod)
    ),
  );
}

/**
 * uploadCodemodAsTreeItem makes a GitHub tree item from a codemod, which
 * potentially involves making a new blob and/or reading an existing file
 * from the repository.
 */
export async function uploadCodemodAsTreeItem(
  api: GitHubAPIClientInterface,
  path: string,
  codemod: GitHubCodemod,
): Promise<GitHubTreeItem> {
  switch (codemod.type) {
    case GitHubCodemodType.ADD_FILE: {
      const blob = await api.postBlobs({
        content: await stringFromBlob(codemod.blob),
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
      const blob = await api.postBlobs({
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
