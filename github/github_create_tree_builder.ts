import type { JSONPatchOperation } from "../deps.ts";
import type {
  GitHubAPIClientInterface,
  GitHubAPITreesPostRequest,
} from "./api/mod.ts";
import type { Generate } from "./generate.ts";
import { generate } from "./generate.ts";
import type {
  GitHubCreateTreeBuilderInterface,
  GitHubCreateTreeOp,
} from "./github_create_tree_builder_interface.ts";

/**
 * GitHubCreateTreeBuilder is a builder for a GitHub create tree request.
 */
export class GitHubCreateTreeBuilder
  implements GitHubCreateTreeBuilderInterface {
  #baseTree: Generate<string | undefined, []>;
  #tree: Map<string, GitHubCreateTreeOp>;

  constructor(
    private readonly options: GitHubAPITreesPostRequest,
    private readonly api: GitHubAPIClientInterface,
  ) {
    this.#baseTree = options.base_tree;
    this.#tree = fromAPI(options.tree);
  }

  clear(): this {
    throw new Error("Method not implemented.");
  }

  base(shaOrSHAGenerate: Generate<string | undefined, []>): this {
    this.#baseTree = shaOrSHAGenerate;
    return this;
  }

  file(path: string, blobOrBlobGenerate: Generate<Blob, [Blob]>): this {
    this.#tree.set(path, {
      type: GitHubCreateTreeOpType.FILE,
      data: blobOrBlobGenerate,
    });
    return this;
  }

  text(path: string, textOrTextGenerate: Generate<string, [string]>): this {
    throw new Error("Method not implemented.");
  }

  jsonPatch<T>(
    path: string,
    patchesOrPatchesGenerate: Generate<JSONPatchOperation[], [string]>,
    deserializeJSON: Generate<(content: string) => T, [string]>,
    serializeJSON: Generate<(value: T) => string, [string]>,
  ): this {
    throw new Error("Method not implemented.");
  }

  executable(path: string, blobOrBlobGenerate: Generate<Blob, [Blob]>): this {
    throw new Error("Method not implemented.");
  }

  subdirectory(path: string, shaOrSHAGenerate: Generate<string, []>): this {
    throw new Error("Method not implemented.");
  }

  submodule(path: string, shaOrSHAGenerate: Generate<string, []>): this {
    throw new Error("Method not implemented.");
  }

  symlink(path: string, blobOrBlobGenerate: Generate<Blob, [Blob]>): this {
    throw new Error("Method not implemented.");
  }

  rename(path: string, pathOrPathGenerate: Generate<string, [string]>): this {
    throw new Error("Method not implemented.");
  }

  delete(path: string): this {
    throw new Error("Method not implemented.");
  }

  public async run(): Promise<GitHubAPITreesPostRequest> {
    // TODO: Use Promise.all to run all the generate functions in parallel.
    const baseTree = await generate(this.#baseTree);
    const tree = await doCreateTreeOps(this.api, this.#tree);
    return {
      base_tree: baseTree,
      tree,
    };
  }
}

/**
 * fromAPI converts a GitHubAPITreesPostRequest tree to an ES6 Map.
 */
export function fromAPI(
  tree: GitHubAPITreesPostRequest["tree"],
): Map<string, GitHubCreateTreeOp> {
  return new Map(
    tree
      .filter((treeItem) => treeItem.path !== undefined)
      .map((treeItem) => [treeItem.path!, treeItem]),
  );
}

/**
 * doTreeOps creates a tree from a map of tree operations.
 */
export async function doTreeOps(
  api: GitHubAPIClientInterface,
  tree: Map<string, GitHubCreateTreeOp>,
): Promise<GitHubAPITreesPostRequest["tree"]> {
  // TODO: Promise.all.
  return [];
}

// TODO: Implement doCreateTreeOp with switch-case statement.

/**
 * doTreeFileOp does a file operation for a create tree builder.
 */
export async function doTreeFileOp(
  api: GitHubAPIClientInterface,
  op: GitHubTreeFileOp, // TODO: The op data is what should be returned.
): Promise<GitHubAPITreesPostRequest["tree"][number]> {
}
