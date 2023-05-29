import type { GitHubAPITreesPostRequest } from "./api/mod.ts";
import type { GitHubCreateTreeBuilderInterface } from "./github_create_tree_builder_interface.ts";

/**
 * GitHubCreateTreeBuilder is a builder for a GitHub create tree request.
 */
export class GitHubCreateTreeBuilder
  implements GitHubCreateTreeBuilderInterface {
  constructor(
    private readonly options: GitHubAPITreesPostRequest,
  ) {}

  public run(): Promise<GitHubAPITreesPostRequest> {
    return Promise.resolve(this.options);
  }
}
