import type { GitHubAPIClientInterface } from "../api/mod.ts";
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
 * getDefaultBranchName gets the default branch name of the repository.
 */
export async function getDefaultBranchName(
  api: GitHubAPIClientInterface,
): Promise<string> {
  return (await api.getRepository()).default_branch;
}

/**
 * createTree creates a GitHub tree.
 */
export async function createTree(
  api: GitHubAPIClientInterface,
  options: GitHubCreateTreeOptions,
): Promise<GitHubTreeResult> {
  let defaultBranchName: string | undefined;
  if (!options.baseBranchName) {
    defaultBranchName = await getDefaultBranchName(api);
    options.baseBranchName = defaultBranchName;
  }

  const baseBranch = await api.getBranch({
    branch: `refs/heads/${options.baseBranchName}`,
  });
  const uploadedTree = await uploadCodemodsAsTree(
    api,
    options.baseBranchName,
    options.codemods,
  );
  const tree = await api.postTrees({
    base_tree: baseBranch.commit.commit.tree.sha,
    tree: uploadedTree,
  });
  return {
    defaultBranchName,
    baseBranch,
    tree,
  };
}

/**
 * uploadCodemodsAsTree makes a GitHub tree from the codemod tree.
 */
export async function uploadCodemodsAsTree(
  api: GitHubAPIClientInterface,
  branch: string,
  codemods: GitHubCodemods,
): Promise<GitHubTree> {
  return await Promise.all(
    Object.entries(codemods).map(([path, codemod]) =>
      uploadCodemodAsTreeItem(api, branch, path, codemod)
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
  branch: string,
  path: string,
  codemod: GitHubCodemod,
): Promise<GitHubTreeItem> {
  switch (codemod.type) {
    case GitHubCodemodType.SET_BLOB: {
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

    case GitHubCodemodType.SET_TEXT: {
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

    case GitHubCodemodType.EDIT_BLOB: {
      const blob = await api.postBlobs({
        encoding: "base64",
        content: await api.getRawFile({ branch, path })
          .then((response) => response.blob())
          .then(codemod.fn)
          .then(stringFromBlob),
      });
      return {
        mode: "100644",
        path,
        sha: blob.sha,
        type: "blob",
      };
    }

    case GitHubCodemodType.EDIT_TEXT: {
      const blob = await api.postBlobs({
        encoding: "utf-8",
        content: await api.getRawFile({ branch, path })
          .then((response) => response.text())
          .then(codemod.fn),
      });
      return {
        mode: "100644",
        path,
        sha: blob.sha,
        type: "blob",
      };
    }

    case GitHubCodemodType.DELETE: {
      return {
        mode: "100644",
        path,
        sha: null,
      };
    }
  }
}
