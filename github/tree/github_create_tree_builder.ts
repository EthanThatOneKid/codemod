import type { JSONPatchOperation } from "../../deps.ts";
import type {
  GitHubAPIClientInterface,
  GitHubAPITreesPostRequest,
} from "../api/mod.ts";
import type { Generate } from "../shared/generate.ts";
import { generate } from "../shared/generate.ts";
import type {
  GitHubCreateTreeBuilderInterface,
  GitHubTreeFileOp,
  GitHubTreeOp,
} from "./github_create_tree_builder_interface.ts";
import { GitHubTreeOpType } from "./github_create_tree_builder_interface.ts";

/**
 * GitHubCreateTreeBuilder is a builder for a GitHub create tree request.
 */
export class GitHubCreateTreeBuilder
  implements GitHubCreateTreeBuilderInterface {
  #baseTree: Generate<string | undefined, []>;
  #ref: Generate<string | undefined, []>;
  #tree: Map<string, GitHubTreeOp> = new Map();

  constructor(private readonly api: GitHubAPIClientInterface) {}

  public clear(): this {
    this.#tree = new Map();
    return this;
  }

  public base(shaOrSHAGenerate: Generate<string | undefined, []>): this {
    this.#baseTree = shaOrSHAGenerate;
    return this;
  }

  public ref(refOrRefGenerate: Generate<string, []>): this {
    this.#ref = refOrRefGenerate;
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
    deserializeJSON: Generate<(content: string) => T, [string]>,
    serializeJSON: Generate<(value: T) => string, [string]>,
  ): this {
    this.#tree.set(path, {
      type: GitHubTreeOpType.JSON_PATCH,
      data: patchesOrPatchesGenerate,
      deserializeJSON,
      serializeJSON: serializeJSON as Generate<(value: unknown) => string, []>,
    });
    return this;
  }

  public executable(
    path: string,
    blobOrBlobGenerate: Generate<Blob, [Blob]>,
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
    blobOrBlobGenerate: Generate<Blob, [Blob]>,
  ): this {
    this.#tree.set(path, {
      type: GitHubTreeOpType.SYMLINK,
      data: blobOrBlobGenerate,
    });
    return this;
  }

  public rename(
    path: string,
    pathOrPathGenerate: Generate<string, [string]>,
  ): this {
    this.#tree.set(path, {
      type: GitHubTreeOpType.RENAME,
      data: pathOrPathGenerate,
    });
    return this;
  }

  public delete(path: string): this {
    this.#tree.set(path, { type: GitHubTreeOpType.DELETE });
    return this;
  }

  public async run(): Promise<GitHubAPITreesPostRequest> {
    const baseTree = await generate(this.#baseTree);
    const tree = await doTreeOps(this.api, this.#tree);
    return makeGitHubAPITreesPostRequest(baseTree, tree);
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
  tree: Map<string, GitHubTreeOp>,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  const ops = [...tree.values()];
  return Promise.all(ops.map((op) => doTreeOp(api, op)));
}

/**
 * doTreeOp does a tree operation.
 */
export function doTreeOp(
  api: GitHubAPIClientInterface,
  op: GitHubTreeOp,
): Promise<GitHubAPITreesPostRequest["tree"][number]> {
  switch (op.type) {
    case GitHubTreeOpType.FILE: {
      return doTreeFileOp(api, op);
    }

    case GitHubTreeOpType.TEXT: {
      return doTreeTextOp(api, op);
    }

    case GitHubTreeOpType.JSON_PATCH: {
      return doTreeJSONPatchOp(api, op);
    }

    case GitHubTreeOpType.EXECUTABLE: {
      return doTreeExecutableOp(api, op);
    }

    case GitHubTreeOpType.SUBDIRECTORY: {
      return doTreeSubdirectoryOp(api, op);
    }

    case GitHubTreeOpType.SUBMODULE: {
      return doTreeSubmoduleOp(api, op);
    }

    case GitHubTreeOpType.SYMLINK: {
      return doTreeSymlinkOp(api, op);
    }

    case GitHubTreeOpType.RENAME: {
      return doTreeRenameOp(api, op);
    }

    case GitHubTreeOpType.DELETE: {
      return doTreeDeleteOp(api, op);
    }
  }
}

/**
 * doTreeFileOp does a file operation for a create tree builder.
 */
export async function doTreeFileOp(
  api: GitHubAPIClientInterface,
  op: GitHubTreeFileOp, // TODO: The op data is what should be returned.
): Promise<GitHubAPITreesPostRequest["tree"][number]> {
  // TODO: Get original blob with API call but get the branch name from the
  // GitHubCreateTreeBuilder.
  const blob = await generate(op.data, [originalBlob]);
  return {
    path: "",
    mode: "100644",
    type: "blob",
    sha: "",
    content: "",
  };
}
