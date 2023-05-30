import type { JSONPatchOperation } from "../../deps.ts";
import { applyJSONPatch, errors } from "../../deps.ts";
import type {
  GitHubAPIClientInterface,
  GitHubAPITreesPostRequest,
} from "../api/mod.ts";
import { Generate, Generated, generateObject } from "../shared/generate.ts";
import { generate } from "../shared/generate.ts";
import type {
  GitHubCreateTreeBuilderInterface,
  GitHubTreeExecutableOp,
  GitHubTreeFileOp,
  GitHubTreeJSONPatchOp,
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
  #base: Generate<string | undefined, []>;
  #tree: Map<string, GitHubTreeOp> = new Map();

  constructor(private readonly api: GitHubAPIClientInterface) {}

  public clear(): this {
    this.#tree = new Map();
    return this;
  }

  public base(shaOrSHAGenerate: Generate<string | undefined, []>): this {
    this.#base = shaOrSHAGenerate;
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

  public jsonPatch<T>(
    path: string,
    patchesOrPatchesGenerate: Generate<JSONPatchOperation[], [string]>,
    deserializeJSON: (content: string) => T,
    serializeJSON: (value: T) => string,
  ): this {
    this.#tree.set(path, {
      type: GitHubTreeOpType.JSON_PATCH,
      data: {
        patches: patchesOrPatchesGenerate,
        deserializeJSON,
        serializeJSON: serializeJSON as (value: unknown) => string,
      },
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

  public async run(): Promise<GitHubAPITreesPostRequest> {
    const ref = await generate(this.#base) ??
      (await this.api.getRepository()).default_branch;
    const baseTreeSHA =
      (await this.api.getBranch({ ref })).commit.commit.tree.sha;
    const tree = await doTreeOps(this.api, ref, this.#tree);
    return makeGitHubAPITreesPostRequest(baseTreeSHA, tree);
  }
}

/**
 * makeGitHubAPITreesPostRequest creates a GitHub API trees post request.
 */
export function makeGitHubAPITreesPostRequest(
  baseTree: string | undefined,
  tree: GitHubAPITreesPostRequest["tree"],
): GitHubAPITreesPostRequest {
  return {
    base_tree: baseTree,
    tree,
  };
}

/**
 * doTreeOps creates a tree from a map of tree operations.
 */
export function doTreeOps(
  api: GitHubAPIClientInterface,
  ref: string,
  tree: Map<string, GitHubTreeOp>,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const ops = [...tree.entries()];
  const opPromises = ops.reduce(
    (tree, [path, op]) => tree.concat(doTreeOp(api, ref, path, op)),
    [] as Array<Promise<GitHubAPITreesPostRequest["tree"][number]>>,
  );
  return Promise.all(opPromises);
}

/**
 * doTreeOp does a tree operation.
 */
export async function doTreeOp(
  api: GitHubAPIClientInterface,
  ref: string,
  path: string,
  op: GitHubTreeOp,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  switch (op.type) {
    case GitHubTreeOpType.FILE: {
      return doTreeFileOp(api, path, op);
    }

    case GitHubTreeOpType.TEXT: {
      return doTreeTextOp(api, path, op);
    }

    case GitHubTreeOpType.JSON_PATCH: {
      return doTreeJSONPatchOp(api, path, op);
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
  }
}

/**
 * doTreeFileOp does a file operation for a create tree builder.
 */
export async function doTreeFileOp(
  api: GitHubAPIClientInterface,
  path: string,
  op: GitHubTreeFileOp,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const existingBlob = await api.getRawBlob({ path })
    .catch((error) => {
      if (error instanceof errors.NotFound) {
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
  return [{
    mode: "100644",
    path,
    sha: createdBlob.sha,
    type: "blob",
  }];
}

/**
 * doTreeTextOp does a text operation for a create tree builder.
 */
export async function doTreeTextOp(
  api: GitHubAPIClientInterface,
  path: string,
  op: GitHubTreeTextOp,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const existingText = await api.getRawText({ path })
    .catch((error) => {
      if (error instanceof errors.NotFound) {
        return "";
      }

      return Promise.reject(error);
    });
  const text = await generate(op.data, existingText);
  return [{
    mode: "100644",
    path,
    content: text,
    type: "blob",
  }];
}

/**
 * doTreeJSONPatchOp does a JSON patch operation for a create tree builder.
 */
export async function doTreeJSONPatchOp(
  api: GitHubAPIClientInterface,
  path: string,
  op: GitHubTreeJSONPatchOp,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const existingText = await api.getRawText({ path });
  const patches = await generate(op.data.patches, existingText);
  const deserializedJSON = op.data.deserializeJSON(existingText);
  const patchedJSON = applyJSONPatch(deserializedJSON, patches);
  const serializedJSON = op.data.serializeJSON(patchedJSON);
  return [{
    mode: "100644",
    path,
    content: serializedJSON,
    type: "blob",
  }];
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
  return [{
    mode: "100755",
    path,
    content,
    type: "blob",
  }];
}

/**
 * doTreeSubdirectoryOp does a subdirectory operation for a create tree builder.
 */
export async function doTreeSubdirectoryOp(
  path: string,
  op: GitHubTreeSubdirectoryOp,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const sha = await generate(op.data);
  return [{
    mode: "040000",
    path,
    sha,
    type: "tree",
  }];
}

/**
 * doTreeSubmoduleOp does a submodule operation for a create tree builder.
 */
export async function doTreeSubmoduleOp(
  path: string,
  op: GitHubTreeSubmoduleOp,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const sha = await generate(op.data);
  return [{
    mode: "160000",
    path,
    sha,
    type: "commit",
  }];
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
  return [{
    mode: "120000",
    path,
    content,
    type: "blob",
  }];
}

/**
 * doTreeRenameOp does a rename operation for a create tree builder.
 */
export async function doTreeRenameOp(
  api: GitHubAPIClientInterface,
  ref: string,
  path: string,
  op: GitHubTreeRenameOp,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const oldPath = path;
  const newPath = op.data;
  const contents = await api.getContents({ path: oldPath, ref });

  // TODO: Figure this out.
  //

  if ((contents as { length: number | undefined }).length !== undefined) {
    throw new Error("Cannot rename a directory");
  }
  const sha = contents;
  return [{
    path: newPath,
    mode: "100644",
    type: "blob",
    sha: sha,
  }, {
    path: oldPath,
    mode: "100644",
    type: "blob",
    sha: null,
  }];
}

/**
 * doTreeDeleteOp does a delete operation for a create tree builder.
 */
export async function doTreeDeleteOp(
  path: string,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  return [{
    path,
    mode: "100644",
    type: "blob",
    sha: null,
  }];
}
