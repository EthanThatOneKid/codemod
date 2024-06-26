import type {
  GitHubAPIClientInterface,
  GitHubAPITreesPostRequest,
} from "../api/mod.ts";
import { errors } from "../api/mod.ts";
import type { Generate } from "../shared/generate.ts";
import { generate } from "../shared/generate.ts";
import type {
  GitHubCreateTreeBuilderInterface,
  GitHubTreeExecutableOp,
  GitHubTreeFileOp,
  GitHubTreeOp,
  GitHubTreeRenameOp,
  GitHubTreeSubdirectoryOp,
  GitHubTreeSubmoduleOp,
  GitHubTreeSymlinkOp,
  GitHubTreeTextOp,
} from "./github_create_tree_builder_interface.ts";
import { GitHubTreeOpType } from "./github_create_tree_builder_interface.ts";
import { stringFromBlob } from "./base64.ts";

/**
 * GitHubCreateTreeBuilder is a builder for a GitHub create tree request.
 */
export class GitHubCreateTreeBuilder
  implements GitHubCreateTreeBuilderInterface {
  #baseRef: Generate<string | undefined | null, []>;
  #fallbackRefs: Generate<string | undefined, []>[] = [];
  #tree: Map<string, GitHubTreeOp> = new Map();

  constructor(
    private readonly api: GitHubAPIClientInterface,
  ) {}

  public async run(): Promise<GitHubAPITreesPostRequest> {
    let ref = await generate(this.#baseRef);
    let sha: string | undefined;

    // Henceforth, ref is undefined if it is null.
    if (ref === null) {
      ref = undefined;
    } else {
      // Use fallback refs if the base ref is undefined.
      const fallbackRefs = this.#fallbackRefs.slice();
      do {
        sha = !ref ? undefined : (
          await this.api.getBranch({ ref }).catch((error) => {
            if (
              error instanceof Error &&
              error.message === errors.notFound.message
            ) {
              return undefined;
            }

            throw error;
          })
        )?.commit.commit.tree.sha;

        if (sha !== undefined) {
          break;
        }

        ref = await generate(fallbackRefs.shift() ?? (() => undefined));
      } while (sha === undefined && fallbackRefs.length > 0);

      if (sha === undefined) {
        ref = (await this.api.getRepository()).default_branch;
        sha = (await this.api.getBranch({ ref })).commit.commit.tree.sha;
      }
    }

    // Generate a tree.
    const tree = await doTreeOps(this.api, ref, this.#tree);
    return makeGitHubAPITreesPostRequest(sha, tree);
  }

  public clear(): this {
    this.#tree = new Map();
    return this;
  }

  public baseRef(
    refOrRefGenerate?: Generate<string | undefined | null, []>,
    ...fallbackRefs: Generate<string | undefined, []>[]
  ): this {
    this.#baseRef = refOrRefGenerate;
    this.#fallbackRefs = fallbackRefs;
    return this;
  }

  public file(path: string, blobOrBlobGenerate: Generate<Blob, [Blob]>): this {
    this.#tree.set(path, {
      type: GitHubTreeOpType.FILE,
      data: blobOrBlobGenerate,
    });
    return this;
  }

  public text(
    path: string,
    textOrTextGenerate: Generate<string, [string]>,
  ): this {
    this.#tree.set(path, {
      type: GitHubTreeOpType.TEXT,
      data: textOrTextGenerate,
    });
    return this;
  }

  public executable(
    path: string,
    blobOrBlobGenerate: Generate<Blob, []>,
  ): this {
    this.#tree.set(path, {
      type: GitHubTreeOpType.EXECUTABLE,
      data: blobOrBlobGenerate,
    });
    return this;
  }

  public subdirectory(
    path: string,
    shaOrSHAGenerate: Generate<string, []>,
  ): this {
    this.#tree.set(path, {
      type: GitHubTreeOpType.SUBDIRECTORY,
      data: shaOrSHAGenerate,
    });
    return this;
  }

  public submodule(path: string, shaOrSHAGenerate: Generate<string, []>): this {
    this.#tree.set(path, {
      type: GitHubTreeOpType.SUBMODULE,
      data: shaOrSHAGenerate,
    });
    return this;
  }

  public symlink(
    path: string,
    blobOrBlobGenerate: Generate<Blob, []>,
  ): this {
    this.#tree.set(path, {
      type: GitHubTreeOpType.SYMLINK,
      data: blobOrBlobGenerate,
    });
    return this;
  }

  public rename(
    oldPath: string,
    newPath: string,
  ): this {
    this.#tree.set(oldPath, {
      type: GitHubTreeOpType.RENAME,
      data: newPath,
    });
    return this;
  }

  public delete(path: string): this {
    this.#tree.set(path, { type: GitHubTreeOpType.DELETE });
    return this;
  }
}

/**
 * makeGitHubAPITreesPostRequest creates a GitHub API trees post request.
 */
export function makeGitHubAPITreesPostRequest(
  baseTreeSHA: string | undefined,
  tree: GitHubAPITreesPostRequest["tree"],
): GitHubAPITreesPostRequest {
  return {
    base_tree: baseTreeSHA,
    tree,
  };
}

/**
 * doTreeOps creates a tree from a map of tree operations.
 */
export function doTreeOps(
  api: GitHubAPIClientInterface,
  ref: string | undefined,
  tree: Map<string, GitHubTreeOp>,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const ops = [...tree.entries()];
  const opPromises = ops
    .map(([path, op]) => doTreeOp(api, ref, path, op));
  return Promise.all(opPromises)
    .then((trees) => trees.flat());
}

/**
 * doTreeOp does a tree operation.
 */
export function doTreeOp(
  api: GitHubAPIClientInterface,
  ref: string | undefined,
  path: string,
  op: GitHubTreeOp,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  switch (op.type) {
    case GitHubTreeOpType.FILE: {
      return doTreeFileOp(api, ref, path, op);
    }

    case GitHubTreeOpType.TEXT: {
      return doTreeTextOp(api, ref, path, op);
    }

    case GitHubTreeOpType.EXECUTABLE: {
      return doTreeExecutableOp(path, op);
    }

    case GitHubTreeOpType.SUBDIRECTORY: {
      return doTreeSubdirectoryOp(path, op);
    }

    case GitHubTreeOpType.SUBMODULE: {
      return doTreeSubmoduleOp(path, op);
    }

    case GitHubTreeOpType.SYMLINK: {
      return doTreeSymlinkOp(path, op);
    }

    case GitHubTreeOpType.RENAME: {
      return doTreeRenameOp(api, ref, path, op);
    }

    case GitHubTreeOpType.DELETE: {
      return doTreeDeleteOp(path);
    }

    default: {
      throw new Error(`Unknown tree operation type`);
    }
  }
}

/**
 * doTreeFileOp does a file operation for a create tree builder.
 */
export async function doTreeFileOp(
  api: GitHubAPIClientInterface,
  ref: string | undefined,
  path: string,
  op: GitHubTreeFileOp,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const existingBlob = await api.getRawBlob({ path, ref })
    .catch((error) => {
      if (error instanceof Error && error.message === errors.notFound.message) {
        return new Blob();
      }

      return Promise.reject(error);
    });
  const blob = await generate(op.data, existingBlob);
  const content = await stringFromBlob(blob);
  const createdBlob = await api.postBlobs({
    encoding: "base64",
    content,
  });
  return [
    {
      mode: "100644",
      path,
      sha: createdBlob.sha,
      type: "blob",
    },
  ];
}

/**
 * doTreeTextOp does a text operation for a create tree builder.
 */
export async function doTreeTextOp(
  api: GitHubAPIClientInterface,
  ref: string | undefined,
  path: string,
  op: GitHubTreeTextOp,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const existingText = await api.getRawText({ path, ref })
    .catch((error) => {
      if (error instanceof Error && error.message === errors.notFound.message) {
        return "";
      }

      return Promise.reject(error);
    });
  const text = await generate(op.data, existingText);
  return [
    {
      mode: "100644",
      path,
      content: text,
      type: "blob",
    },
  ];
}

/**
 * doTreeExecutableOp does an executable operation for a create tree builder.
 */
export async function doTreeExecutableOp(
  path: string,
  op: GitHubTreeExecutableOp,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const blob = await generate(op.data);
  const content = await stringFromBlob(blob);
  return [
    {
      mode: "100755",
      path,
      content,
      type: "blob",
    },
  ];
}

/**
 * doTreeSubdirectoryOp does a subdirectory operation for a create tree builder.
 */
export async function doTreeSubdirectoryOp(
  path: string,
  op: GitHubTreeSubdirectoryOp,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const sha = await generate(op.data);
  return [
    {
      mode: "040000",
      path,
      sha,
      type: "tree",
    },
  ];
}

/**
 * doTreeSubmoduleOp does a submodule operation for a create tree builder.
 */
export async function doTreeSubmoduleOp(
  path: string,
  op: GitHubTreeSubmoduleOp,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const sha = await generate(op.data);
  return [
    {
      mode: "160000",
      path,
      sha,
      type: "commit",
    },
  ];
}

/**
 * doTreeSymlinkOp does a symlink operation for a create tree builder.
 */
export async function doTreeSymlinkOp(
  path: string,
  op: GitHubTreeSymlinkOp,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const blob = await generate(op.data);
  const content = await stringFromBlob(blob);
  return [
    {
      mode: "120000",
      path,
      content,
      type: "blob",
    },
  ];
}

/**
 * doTreeRenameOp does a rename operation for a create tree builder.
 */
export async function doTreeRenameOp(
  api: GitHubAPIClientInterface,
  ref: string | undefined,
  path: string,
  op: GitHubTreeRenameOp,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const oldPath = path;
  const newPath = op.data;
  const contents = await api.getContents({ path: oldPath, ref })
    .catch((error) => {
      if (error instanceof Error && error.message === errors.notFound.message) {
        return null;
      }

      throw error;
    });
  if (contents === null) {
    throw new Error("Cannot rename a non-existent file");
  }

  if (Array.isArray(contents)) {
    throw new Error("Cannot operate on a directory");
  }

  if (contents.type === "symlink") {
    throw new Error("Cannot operate on a symlink");
  }

  if (contents.type === "submodule") {
    throw new Error("Cannot operate on a submodule");
  }

  return [
    {
      path: oldPath,
      mode: "100644",
      type: "blob",
      sha: null,
    },
    {
      path: newPath,
      mode: "100644",
      type: "blob",
      sha: contents.sha,
    },
  ];
}

/**
 * doTreeDeleteOp does a delete operation for a create tree builder.
 */
export function doTreeDeleteOp(
  path: string,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  return Promise.resolve([
    {
      path,
      mode: "100644",
      type: "blob",
      sha: null,
    },
  ]);
}
