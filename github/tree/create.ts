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
export async function createTree<T>(
  api: GitHubAPIClientInterface,
  options: GitHubCreateTreeOptions<T>,
): Promise<GitHubTreeResult<T>> {
  // If base branch is not provided, get the default branch.
  let defaultBranchName: string | undefined;
  if (!options.baseBranchName) {
    defaultBranchName = await getDefaultBranchName(api);
    options.baseBranchName = defaultBranchName;
  }

  const baseBranch = await api.getBranch({
    branch: `refs/heads/${options.baseBranchName}`,
  });
  const [uploadedTree, data] = await uploadCodemodsAsTree(
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
    data,
  };
}

/**
 * uploadCodemodsAsTree makes a GitHub tree from the codemod tree.
 */
export async function uploadCodemodsAsTree<T>(
  api: GitHubAPIClientInterface,
  branch: string,
  codemods: GitHubCodemods<T>,
): Promise<[GitHubTree] | [GitHubTree, T]> {
  const [tree, data] = (await Promise.all(
    Object.entries(codemods).map(([path, codemod]) =>
      uploadCodemodAsTreeItem(api, branch, path, codemod)
    ),
  ))
    .reduce<[GitHubTree, T | undefined]>(
      ([tree, data], [item, itemData]) => {
        tree.push(item);
        return [tree, itemData ?? data];
      },
      [[], undefined],
    );
  if (!data) {
    return [tree];
  }

  return [tree, data];
}

/**
 * uploadCodemodAsTreeItem makes a GitHub tree item from a codemod, which
 * potentially involves making a new blob and/or reading an existing file
 * from the repository.
 */
export async function uploadCodemodAsTreeItem<T>(
  api: GitHubAPIClientInterface,
  branch: string,
  path: string,
  codemod: GitHubCodemod<T>,
): Promise<[GitHubTreeItem] | [GitHubTreeItem, T]> {
  switch (codemod.type) {
    case GitHubCodemodType.SET_BLOB: {
      const blob = await api.postBlobs({
        content: await stringFromBlob(codemod.blob),
        encoding: "base64",
      });
      return [{ mode: "100644", path, sha: blob.sha, type: "blob" }];
    }

    case GitHubCodemodType.SET_TEXT: {
      const blob = await api.postBlobs({
        content: codemod.content,
        encoding: "utf-8",
      });
      return [{ mode: "100644", path, sha: blob.sha, type: "blob" }];
    }

    case GitHubCodemodType.EDIT_BLOB: {
      const [content, data] = await api.getRawFile({ branch, path })
        .then((response) => response.blob())
        .then(codemod.fn)
        .then(async (result) => {
          if (result instanceof Blob) {
            return [await stringFromBlob(result)] as const;
          }

          if (result[1] === undefined) {
            return [await stringFromBlob(result[0])] as const;
          }

          return [await stringFromBlob(result[0]), result[1]] as const;
        });

      const blob = await api.postBlobs({ encoding: "base64", content });
      const treeItem: GitHubTreeItem = {
        mode: "100644",
        path,
        sha: blob.sha,
        type: "blob",
      };
      if (!data) {
        return [treeItem];
      }

      return [treeItem, data];
    }

    case GitHubCodemodType.EDIT_TEXT: {
      const [content, data] = await api.getRawFile({ branch, path })
        .then((response) => response.text())
        .then(codemod.fn)
        .then((result) => {
          if (typeof result === "string") {
            return [result] as const;
          }

          if (result[1] === undefined) {
            return [result[0]] as const;
          }

          return [result[0], result[1]] as const;
        });

      const blob = await api.postBlobs({ encoding: "utf-8", content });
      const treeItem: GitHubTreeItem = {
        mode: "100644",
        path,
        sha: blob.sha,
        type: "blob",
      };
      if (!data) {
        return [treeItem];
      }

      return [treeItem, data];
    }

    case GitHubCodemodType.DELETE: {
      return [{ mode: "100644", path, sha: null }];
    }
  }
}
