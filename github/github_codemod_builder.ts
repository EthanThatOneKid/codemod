import type {
  GitHubAPIClientInterface,
  GitHubAPIClientOptions,
  GitHubAPICommitsPostResponse,
  GitHubAPIPullPatchRequest,
  GitHubAPIPullPatchResponse,
  GitHubAPIPullsPostResponse,
  GitHubAPIRefPatchResponse,
  GitHubAPIRefsPostResponse,
  GitHubAPITreesPostResponse,
} from "./api/mod.ts";
import { GitHubAPIClient } from "./api/mod.ts";
import {
  GitHubAPICommitsPostRequestGenerate,
  GitHubAPIPullPatchRequestGenerate,
  GitHubAPIPullsPostRequestGenerate,
  GitHubAPIRefPatchRequestGenerate,
  GitHubAPIRefsPostRequestGenerate,
  GitHubAPITreesPostRequestGenerate,
  GitHubCodemodBuilderInterface,
  GitHubOp,
  GitHubOpResult,
  GitHubOpType,
} from "./github_codemod_builder_interface.ts";
import { Append } from "./types.ts";

/**
 * GitHubCodemodBuilder is a builder for building a GitHub codemod.
 */
export class GitHubCodemodBuilder<R extends GitHubOpResult[] = []>
  implements GitHubCodemodBuilderInterface<R> {
  constructor(
    private readonly ops: GitHubOp<R>[] = [],
    private readonly fetcher: typeof fetch = fetch.bind(globalThis),
  ) {}

  public async run(options: GitHubAPIClientOptions): Promise<R> {
    const api = new GitHubAPIClient(options, this.fetcher);
    const result: Array<R[number]> = [];
    for (const op of this.ops) {
      switch (op.type) {
        case GitHubOpType.CREATE_TREE: {
          const options = op.data instanceof Function
            ? await op.data(result as R)
            : op.data;
          const response = await api.postTrees(options);
          result.push(response as R[number]);
          break;
        }

        case GitHubOpType.CREATE_COMMIT: {
          const options = op.data instanceof Function
            ? await op.data(result as R)
            : op.data;
          const response = await api.postCommits(options);
          result.push(response as R[number]);
          break;
        }

        case GitHubOpType.CREATE_BRANCH: {
          const options = op.data instanceof Function
            ? await op.data(result as R)
            : op.data;
          const response = await api.postRefs(options);
          result.push(response as R[number]);
          break;
        }

        case GitHubOpType.UPDATE_BRANCH: {
          const options = op.data instanceof Function
            ? await op.data(result as R)
            : op.data;
          const response = await api.patchRef(options);
          result.push(response as R[number]);
          break;
        }

        // TODO: Implement.
        case GitHubOpType.CREATE_OR_UPDATE_BRANCH: {
          const options = op.data instanceof Function
            ? await op.data(result as R)
            : op.data;
          const response = await api.postRefs(options);
          result.push(response as R[number]);
          break;
        }

        case GitHubOpType.CREATE_PR: {
          const options = op.data instanceof Function
            ? await op.data(result as R)
            : op.data;
          const response = await api.postPulls(options);
          result.push(response as R[number]);
          break;
        }

        // TODO: Implement.
        case GitHubOpType.UPDATE_PR: {
          const options = op.data instanceof Function
            ? await op.data(result as R)
            : op.data;
          const response = await api.patchPull(options);
          result.push(response as R[number]);
          break;
        }

        // TODO: Implement.
        case GitHubOpType.CREATE_OR_UPDATE_PR: {
          const options = op.data instanceof Function
            ? await op.data(result as R)
            : op.data;
          const response = await api.postPulls(options);
          result.push(response as R[number]);
          break;
        }
      }
    }

    return result as R;
  }

  public clone(): GitHubCodemodBuilderInterface<R> {
    return new GitHubCodemodBuilder<R>(this.ops, this.fetcher);
  }

  public createTree(
    optionsOrOptionsGenerate: GitHubAPITreesPostRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPITreesPostResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.CREATE_TREE,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      Append<R, [GitHubAPITreesPostResponse]>
    >;
  }

  public createCommit(
    optionsOrOptionsGenerate: GitHubAPICommitsPostRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPICommitsPostResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.CREATE_COMMIT,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      Append<R, [GitHubAPICommitsPostResponse]>
    >;
  }

  public createBranch(
    optionsOrOptionsGenerate: GitHubAPIRefsPostRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIRefsPostResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.CREATE_BRANCH,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      Append<R, [GitHubAPIRefsPostResponse]>
    >;
  }

  public updateBranch(
    optionsOrOptionsGenerate: GitHubAPIRefPatchRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIRefPatchResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.UPDATE_BRANCH,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      Append<R, [GitHubAPIRefPatchResponse]>
    >;
  }

  public createOrUpdateBranch(
    optionsOrOptionsGenerate: GitHubAPIRefPatchRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIRefPatchResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.CREATE_OR_UPDATE_BRANCH,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      Append<R, [GitHubAPIRefPatchResponse]>
    >;
  }

  public createPR(
    optionsOrOptionsGenerate: GitHubAPIPullsPostRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIPullsPostResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.CREATE_PR,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      Append<R, [GitHubAPIPullsPostResponse]>
    >;
  }

  public updatePR(
    optionsOrOptionsGenerate: GitHubAPIPullPatchRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIPullPatchResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.UPDATE_PR,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      Append<R, [GitHubAPIPullPatchResponse]>
    >;
  }

  public createOrUpdatePR(
    optionsOrOptionsGenerate: GitHubAPIPullPatchRequest,
  ): GitHubCodemodBuilderInterface<
    Append<R, [GitHubAPIPullPatchResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.CREATE_OR_UPDATE_PR,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      Append<R, [GitHubAPIPullPatchResponse]>
    >;
  }
}
