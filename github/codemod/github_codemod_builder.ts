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
} from "../api/mod.ts";
import { GitHubAPIClient } from "../api/mod.ts";
import { Append } from "../shared/append.ts";
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
import { GitHubCreateTreeBuilder } from "../tree/github_create_tree_builder.ts";
import { generate } from "../shared/generate.ts";

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
          const options = await generate(op.data, [...result] as R) ??
            { tree: [] };
          const response = await api.postTrees(options);
          result.push(response as R[number]);
          break;
        }

        case GitHubOpType.CREATE_COMMIT: {
          const options = await generate(op.data, [...result] as R);
          const response = await api.postCommits(options);
          result.push(response as R[number]);
          break;
        }

        case GitHubOpType.CREATE_BRANCH: {
          const options = await generate(op.data, [...result] as R);
          const response = await api.postRefs(options);
          result.push(response as R[number]);
          break;
        }

        case GitHubOpType.UPDATE_BRANCH:
        case GitHubOpType.CREATE_OR_UPDATE_BRANCH: {
          const options = await generate(op.data, [...result] as R);
          const response = await api.patchRef(options);
          result.push(response as R[number]);
          break;
        }

        case GitHubOpType.CREATE_PR: {
          const options = await generate(op.data, [...result] as R);
          const response = await api.postPulls(options);
          result.push(response as R[number]);
          break;
        }

        // TODO: Implement.
        case GitHubOpType.UPDATE_PR:
        case GitHubOpType.CREATE_OR_UPDATE_PR: {
          const options = await generate(op.data, [...result] as R);
          const response = await api.patchPull(options);
          result.push(response as R[number]);
          break;
        }

        default: {
          throw new Error(`Unknown op type: ${JSON.stringify(op)}`);
        }
      }
    }

    return result as R;
  }
}
