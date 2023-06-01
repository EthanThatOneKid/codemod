import type {
  GitHubAPIClientOptions,
  GitHubAPICommitsPostResponse,
  GitHubAPIPullPatchResponse,
  GitHubAPIPullsPostResponse,
  GitHubAPIRefPatchResponse,
  GitHubAPIRefsPostResponse,
  GitHubAPITreesPostResponse,
} from "../api/mod.ts";
import { GitHubAPIClient } from "../api/mod.ts";
import {
  GitHubCodemodBuilderInterface,
  GitHubOp,
  GitHubOpResult,
  GitHubOpResultOf,
  GitHubOpType,
  GitHubTreeOp,
} from "./github_codemod_builder_interface.ts";
// import { GitHubCreateTreeBuilder } from "../tree/github_create_tree_builder.ts";
import type { Append } from "../shared/append.ts";
import type { Generate } from "../shared/generate.ts";
import { generate } from "../shared/generate.ts";
import type { GitHubCreateTreeBuilderInterface } from "../tree/github_create_tree_builder_interface.ts";
import { GitHubCreateTreeBuilder } from "../tree/github_create_tree_builder.ts";
import type { GitHubCreateBranchBuilderInterface } from "../branch/github_create_branch_builder_interface.ts";
import type { GitHubUpdateBranchBuilderInterface } from "../branch/github_update_branch_builder_interface.ts";
import type { GitHubCreateCommitBuilderInterface } from "../commit/github_create_commit_builder_interface.ts";
import type { GitHubCreatePRBuilderInterface } from "../pr/github_create_pr_builder_interface.ts";
import type { GitHubUpdatePRBuilderInterface } from "../pr/github_update_pr_builder_interface.ts";

/**
 * GitHubCodemodBuilder is a builder for building a GitHub codemod.
 */
export class GitHubCodemodBuilder<R extends GitHubOpResult[] = []>
  implements GitHubCodemodBuilderInterface<R> {
  #api: GitHubAPIClient;

  constructor(
    private readonly ops: Array<(result: R) => Promise<GitHubOp<R>>> = [],
    private readonly options: GitHubAPIClientOptions,
    private readonly fetcher: typeof fetch = fetch.bind(globalThis),
  ) {
    this.#api = new GitHubAPIClient(options, fetcher);
  }

  public async run(): Promise<R> {
    const api = new GitHubAPIClient(this.options, this.fetcher);
    const result: Array<R[number]> = [];
    for (const lazyOp of this.ops) {
      const op = await lazyOp([...result] as R);
      switch (op.type) {
        case GitHubOpType.CREATE_TREE: {
          const options = await generate(op.data, [...result] as R) ??
            { tree: [] };
          const response = await api.postTrees(options);
          result.push(response);
          break;
        }

        case GitHubOpType.CREATE_COMMIT: {
          const options = await generate(op.data, [...result] as R);
          const response = await api.postCommits(options);
          result.push(response);
          break;
        }

        case GitHubOpType.CREATE_BRANCH: {
          const options = await generate(op.data, [...result] as R);
          const response = await api.postRefs(options);
          result.push(response);
          break;
        }

        case GitHubOpType.UPDATE_BRANCH: {
          const options = await generate(op.data, [...result] as R);
          const response = await api.patchRef(options);
          result.push(response);
          break;
        }

        case GitHubOpType.CREATE_PR: {
          const options = await generate(op.data, [...result] as R);
          const response = await api.postPulls(options);
          result.push(response);
          break;
        }

        case GitHubOpType.UPDATE_PR: {
          const options = await generate(op.data, [...result] as R);
          const response = await api.patchPull(options);
          result.push(response);
          break;
        }

        default: {
          throw new Error(`Unknown op type: ${JSON.stringify(op)}`);
        }
      }
    }

    return result as R;
  }

  public op<T extends GitHubOp<R>>(
    opOrOpGenerate: Generate<T, [R]>,
  ): GitHubCodemodBuilder<Append<R, [GitHubOpResultOf<R, T>]>> {
    this.ops.push(
      (result: R) => generate(opOrOpGenerate, [...result] as R),
    );
    return this as unknown as GitHubCodemodBuilder<
      Append<R, [GitHubOpResultOf<R, T>]>
    >;
  }

  public createTree(
    builderOrBuilderGenerate: Generate<
      GitHubCreateTreeBuilderInterface,
      [GitHubCreateTreeBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPITreesPostResponse]>
  > {
    return this.op<GitHubTreeOp<R>>({
      type: GitHubOpType.CREATE_TREE,
      data: async (result: R) => {
        const builder = await generate(
          builderOrBuilderGenerate,
          new GitHubCreateTreeBuilder(this.#api),
          [...result] as R,
        );
        return await builder.run();
      },
    });
  }

  public createCommit(
    builderOrBuilderGenerate: Generate<
      GitHubCreateCommitBuilderInterface,
      [GitHubCreateCommitBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPICommitsPostResponse]>
  > {
    throw new Error("Not implemented");
  }

  public createBranch(
    builderOrBuilderGenerate: Generate<
      GitHubCreateBranchBuilderInterface,
      [GitHubCreateBranchBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIRefsPostResponse]>
  > {
    throw new Error("Not implemented");
  }

  public updateBranch(
    builderOrBuilderGenerate: Generate<
      GitHubUpdateBranchBuilderInterface,
      [GitHubUpdateBranchBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIRefPatchResponse]>
  > {
    throw new Error("Not implemented");
  }

  public createPR(
    builderOrBuilderGenerate: Generate<
      GitHubCreatePRBuilderInterface,
      [GitHubCreatePRBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIPullsPostResponse]>
  > {
    throw new Error("Not implemented");
  }

  public updatePR(
    builderOrBuilderGenerate: Generate<
      GitHubUpdatePRBuilderInterface,
      [GitHubUpdatePRBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIPullPatchResponse]>
  > {
    throw new Error("Not implemented");
  }
}
