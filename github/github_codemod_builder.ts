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
  Append,
  GitHubAPICommitsPostRequestGenerate,
  GitHubAPIPullPatchRequestGenerate,
  GitHubAPIPullsPostRequestGenerate,
  GitHubAPIRefPatchRequestGenerate,
  GitHubAPIRefsPostRequestGenerate,
  GitHubAPITreesPostRequestGenerate,
  GitHubCodemodBuilderInterface,
  GitHubMapOpGenerate,
  GitHubOp,
  GitHubOpResult,
  GitHubOpType,
} from "./github_codemod_builder_interface.ts";

/**
 * GitHubCodemodBuilder is a builder for building a GitHub codemod.
 */
export class GitHubCodemodBuilder<M, R extends GitHubOpResult<M>[] = []>
  implements GitHubCodemodBuilderInterface<M, R> {
  private readonly api: GitHubAPIClientInterface;

  constructor(
    private readonly options: GitHubAPIClientOptions,
    private readonly ops: GitHubOp<R, M>[] = [],
    private readonly fetcher: typeof fetch = fetch.bind(globalThis),
  ) {
    this.api = new GitHubAPIClient(options, fetcher);
  }

  public async run(): Promise<R> {
    const result: Array<R[number]> = [];

    for (const op of this.ops) {
      switch (op.type) {
        case GitHubOpType.MAP: {
          const mapped = op.data instanceof Function
            ? await op.data(result as R)
            : op.data;
          result.push(mapped as R[number]);
          break;
        }

        case GitHubOpType.CREATE_TREE: {
          const options = op.data instanceof Function
            ? await op.data(result as R)
            : op.data;
          const response = await this.api.postTrees(options);
          result.push(response as R[number]);
          break;
        }

        case GitHubOpType.CREATE_COMMIT:
        case GitHubOpType.CREATE_BRANCH:
        case GitHubOpType.UPDATE_BRANCH:
        case GitHubOpType.CREATE_OR_UPDATE_BRANCH:
        case GitHubOpType.CREATE_PR:
        case GitHubOpType.UPDATE_PR:
        case GitHubOpType.CREATE_OR_UPDATE_PR:
      }
    }

    return result as R;
  }

  public clone(): GitHubCodemodBuilderInterface<M, R> {
    return new GitHubCodemodBuilder<M, R>(this.options, this.ops, this.fetcher);
  }

  public map(
    optionsOrOptionsGenerate: GitHubMapOpGenerate<M, R>,
  ): GitHubCodemodBuilderInterface<M, Append<R, [M]>> {
    this.ops.push({
      type: GitHubOpType.MAP,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<M, Append<R, [M]>>;
  }

  public createTree(
    optionsOrOptionsGenerate: GitHubAPITreesPostRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPITreesPostResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.CREATE_TREE,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      M,
      Append<R, [GitHubAPITreesPostResponse]>
    >;
  }

  public createCommit(
    optionsOrOptionsGenerate: GitHubAPICommitsPostRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPICommitsPostResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.CREATE_COMMIT,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      M,
      Append<R, [GitHubAPICommitsPostResponse]>
    >;
  }

  public createBranch(
    optionsOrOptionsGenerate: GitHubAPIRefsPostRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPIRefsPostResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.CREATE_BRANCH,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      M,
      Append<R, [GitHubAPIRefsPostResponse]>
    >;
  }

  public updateBranch(
    optionsOrOptionsGenerate: GitHubAPIRefPatchRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPIRefPatchResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.UPDATE_BRANCH,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      M,
      Append<R, [GitHubAPIRefPatchResponse]>
    >;
  }

  public createOrUpdateBranch(
    optionsOrOptionsGenerate: GitHubAPIRefPatchRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPIRefPatchResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.CREATE_OR_UPDATE_BRANCH,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      M,
      Append<R, [GitHubAPIRefPatchResponse]>
    >;
  }

  public createPR(
    optionsOrOptionsGenerate: GitHubAPIPullsPostRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPIPullsPostResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.CREATE_PR,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      M,
      Append<R, [GitHubAPIPullsPostResponse]>
    >;
  }

  public updatePR(
    optionsOrOptionsGenerate: GitHubAPIPullPatchRequestGenerate<R>,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPIPullPatchResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.UPDATE_PR,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      M,
      Append<R, [GitHubAPIPullPatchResponse]>
    >;
  }

  public createOrUpdatePR(
    optionsOrOptionsGenerate: GitHubAPIPullPatchRequest,
  ): GitHubCodemodBuilderInterface<
    M,
    Append<R, [GitHubAPIPullPatchResponse]>
  > {
    this.ops.push({
      type: GitHubOpType.CREATE_OR_UPDATE_PR,
      data: optionsOrOptionsGenerate,
    });
    return this as unknown as GitHubCodemodBuilderInterface<
      M,
      Append<R, [GitHubAPIPullPatchResponse]>
    >;
  }
}
