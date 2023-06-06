import type {
  GitHubAPIClientOptions,
  GitHubAPICommitsPostRequest,
  GitHubAPIPullPatchRequest,
  GitHubAPIPullsPostRequest,
  GitHubAPIRefPatchRequest,
  GitHubAPIRefsPostRequest,
} from "../api/mod.ts";
import { GitHubAPIClient } from "../api/mod.ts";
import {
  GitHubCodemodBuilderInterface,
  GitHubCreateBranchOp,
  GitHubCreateBranchOpResult,
  GitHubCreateCommitOp,
  GitHubCreateCommitOpResult,
  GitHubCreateOrUpdateBranchOp,
  GitHubCreateOrUpdateBranchOpResult,
  GitHubCreateOrUpdatePROp,
  GitHubCreateOrUpdatePROpResult,
  GitHubCreatePROp,
  GitHubCreatePROpResult,
  GitHubCreateTreeOp,
  GitHubCreateTreeOpResult,
  GitHubOp,
  GitHubOpResult,
  GitHubOpResultOf,
  GitHubOpType,
  GitHubUpdateBranchOp,
  GitHubUpdateBranchOpResult,
  GitHubUpdatePROp,
  GitHubUpdatePROpResult,
} from "./github_codemod_builder_interface.ts";
import type { Append } from "../shared/append.ts";
import { Generate } from "../shared/generate.ts";
import { generate } from "../shared/generate.ts";
import type { GitHubCreateTreeBuilderInterface } from "../tree/github_create_tree_builder_interface.ts";
import { GitHubCreateTreeBuilder } from "../tree/github_create_tree_builder.ts";
import type { GitHubCreateCommitBuilderInterface } from "../commit/mod.ts";
import { GitHubCreateCommitBuilder } from "../commit/mod.ts";
import type { GitHubCreateBranchBuilderInterface } from "../branch/mod.ts";
import { GitHubCreateBranchBuilder } from "../branch/mod.ts";
import type { GitHubUpdateBranchBuilderInterface } from "../branch/mod.ts";
import { GitHubUpdateBranchBuilder } from "../branch/mod.ts";
import type { GitHubCreatePRBuilderInterface } from "../pr/mod.ts";
import { GitHubCreatePRBuilder } from "../pr/mod.ts";
import type { GitHubUpdatePRBuilderInterface } from "../pr/mod.ts";
import { GitHubUpdatePRBuilder } from "../pr/mod.ts";

/**
 * GitHubCodemodBuilder is a builder for building a GitHub codemod.
 */
export class GitHubCodemodBuilder<R extends GitHubOpResult[] = []>
  implements GitHubCodemodBuilderInterface<R> {
  #api: GitHubAPIClient;

  constructor(
    private readonly options: GitHubAPIClientOptions,
    private readonly ops: Array<(result: R) => Promise<GitHubOp<R>>> = [],
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
          console.log({ options });
          const response = await api.patchRef(options);
          result.push(response);
          break;
        }

        case GitHubOpType.CREATE_OR_UPDATE_BRANCH: {
          // TODO: Implement this. Check existing branch.
          throw new Error("Not implemented");
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

        case GitHubOpType.CREATE_OR_UPDATE_PR: {
          // TODO: Implement this. Check existing PR.
          throw new Error("Not implemented");
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
  ): GitHubCodemodBuilderInterface<Append<R, [GitHubOpResultOf<R, T>]>> {
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
    Append<R, [GitHubCreateTreeOpResult]>
  > {
    return this.op<GitHubCreateTreeOp<R>>({
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
    optionsOrOptionsGenerate: Generate<GitHubAPICommitsPostRequest, [R]>,
    builderOrBuilderGenerate?: Generate<
      GitHubCreateCommitBuilderInterface,
      [GitHubCreateCommitBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubCreateCommitOpResult]>
  > {
    return this.op<GitHubCreateCommitOp<R>>({
      type: GitHubOpType.CREATE_COMMIT,
      data: async (result: R) => {
        const options = await generate(
          optionsOrOptionsGenerate,
          [...result] as R,
        );
        const builder = await generate(
          builderOrBuilderGenerate,
          new GitHubCreateCommitBuilder(this.#api, options),
          [...result] as R,
        );
        if (!builder) {
          return options;
        }

        return await builder.run();
      },
    });
  }

  public createBranch(
    optionsOrOptionsGenerate: Generate<GitHubAPIRefsPostRequest, [R]>,
    builderOrBuilderGenerate?: Generate<
      GitHubCreateBranchBuilderInterface,
      [GitHubCreateBranchBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubCreateBranchOpResult]>
  > {
    return this.op<GitHubCreateBranchOp<R>>({
      type: GitHubOpType.CREATE_BRANCH,
      data: async (result: R) => {
        const options = await generate(
          optionsOrOptionsGenerate,
          [...result] as R,
        );
        const builder = await generate(
          builderOrBuilderGenerate,
          new GitHubCreateBranchBuilder(options),
          [...result] as R,
        );
        if (!builder) {
          return options;
        }

        return await builder.run();
      },
    });
  }

  public updateBranch(
    optionsOrOptionsGenerate: Generate<GitHubAPIRefPatchRequest, [R]>,
    builderOrBuilderGenerate?: Generate<
      GitHubUpdateBranchBuilderInterface,
      [GitHubUpdateBranchBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubUpdateBranchOpResult]>
  > {
    return this.op<GitHubUpdateBranchOp<R>>({
      type: GitHubOpType.UPDATE_BRANCH,
      data: async (result: R) => {
        const options = await generate(
          optionsOrOptionsGenerate,
          [...result] as R,
        );
        const builder = await generate(
          builderOrBuilderGenerate,
          new GitHubUpdateBranchBuilder(options),
          [...result] as R,
        );
        if (!builder) {
          return options;
        }

        return await builder.run();
      },
    });
  }

  public createOrUpdateBranch(
    createOptionsOrCreateOptionsGenerate: Generate<
      GitHubAPIRefsPostRequest,
      [R]
    >,
    updateOptionsOrUpdateOptionsGenerate?: Generate<
      GitHubAPIRefPatchRequest,
      [R]
    >,
    createBuilderOrCreateBuilderGenerate?: Generate<
      GitHubCreateBranchBuilderInterface,
      [GitHubCreateBranchBuilderInterface, R]
    >,
    updateBuilderOrUpdateBuilderGenerate?: Generate<
      GitHubUpdateBranchBuilderInterface,
      [GitHubUpdateBranchBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubCreateOrUpdateBranchOpResult]>
  > {
    return this.op<GitHubCreateOrUpdateBranchOp<R>>({
      type: GitHubOpType.CREATE_OR_UPDATE_BRANCH,
      data: {
        create: async (result: R) => {
          const options = await generate(
            createOptionsOrCreateOptionsGenerate,
            [...result] as R,
          );
          const builder = await generate(
            createBuilderOrCreateBuilderGenerate,
            new GitHubCreateBranchBuilder(options),
            [...result] as R,
          );
          if (!builder) {
            return options;
          }

          return await builder.run();
        },
        update: async (result: R) => {
          const options = await generate(
            updateOptionsOrUpdateOptionsGenerate ??
              createOptionsOrCreateOptionsGenerate,
            [...result] as R,
          );
          const builder = await generate(
            updateBuilderOrUpdateBuilderGenerate,
            new GitHubUpdateBranchBuilder(options),
            [...result] as R,
          );
          if (!builder) {
            return options;
          }

          return await builder.run();
        },
      },
    });
  }

  public createPR(
    optionsOrOptionsGenerate: Generate<GitHubAPIPullsPostRequest, [R]>,
    builderOrBuilderGenerate?: Generate<
      GitHubCreatePRBuilderInterface,
      [GitHubCreatePRBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubCreatePROpResult]>
  > {
    return this.op<GitHubCreatePROp<R>>({
      type: GitHubOpType.CREATE_PR,
      data: async (result: R) => {
        const options = await generate(
          optionsOrOptionsGenerate,
          [...result] as R,
        );
        const builder = await generate(
          builderOrBuilderGenerate,
          new GitHubCreatePRBuilder(options),
          [...result] as R,
        );
        if (!builder) {
          return options;
        }

        return await builder.run();
      },
    });
  }

  public updatePR(
    optionsOrOptionsGenerate: Generate<GitHubAPIPullPatchRequest, [R]>,
    builderOrBuilderGenerate?: Generate<
      GitHubUpdatePRBuilderInterface,
      [GitHubUpdatePRBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubUpdatePROpResult]>
  > {
    return this.op<GitHubUpdatePROp<R>>({
      type: GitHubOpType.UPDATE_PR,
      data: async (result: R) => {
        const options = await generate(
          optionsOrOptionsGenerate,
          [...result] as R,
        );
        const builder = await generate(
          builderOrBuilderGenerate,
          new GitHubUpdatePRBuilder(options),
          [...result] as R,
        );
        if (!builder) {
          return options;
        }

        return await builder.run();
      },
    });
  }

  public createOrUpdatePR(
    createOptionsOrCreateOptionsGenerate: Generate<
      GitHubAPIPullsPostRequest,
      [R]
    >,
    updateOptionsOrUpdateOptionsGenerate?: Generate<
      GitHubAPIPullPatchRequest,
      [R]
    >,
    createBuilderOrCreateBuilderGenerate?: Generate<
      GitHubCreatePRBuilderInterface,
      [GitHubCreatePRBuilderInterface, R]
    >,
    updateBuilderOrUpdateBuilderGenerate?: Generate<
      GitHubUpdatePRBuilderInterface,
      [GitHubUpdatePRBuilderInterface, R]
    >,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubCreateOrUpdatePROpResult]>
  > {
    return this.op<GitHubCreateOrUpdatePROp<R>>({
      type: GitHubOpType.CREATE_OR_UPDATE_PR,
      data: {
        create: async (result: R) => {
          const options = await generate(
            createOptionsOrCreateOptionsGenerate,
            [...result] as R,
          );
          const builder = await generate(
            createBuilderOrCreateBuilderGenerate,
            new GitHubCreatePRBuilder(options),
            [...result] as R,
          );
          if (!builder) {
            return options;
          }

          return await builder.run();
        },
        update: async (result: R) => {
          const options = await generate(
            updateOptionsOrUpdateOptionsGenerate ??
              createOptionsOrCreateOptionsGenerate,
            [...result] as R,
          );
          const builder = await generate(
            updateBuilderOrUpdateBuilderGenerate,
            new GitHubUpdatePRBuilder(options),
            [...result] as R,
          );
          if (!builder) {
            return options;
          }

          return await builder.run();
        },
      },
    });
  }
}
