import type { GitHubAPITreesPostResponse } from "./api/mod.ts";

/**
 * GitHubCodemodCreateTreeBuilderInterface is an interface for a GitHubCodemodCreateTreeBuilder.
 *
 * @see https://docs.github.com/en/rest/reference/git#create-a-tree
 */
export interface GitHubCodemodCreateTreeBuilderInterface {
  /**
   * run executes the builder.
   */
  run(): Promise<GitHubAPITreesPostResponse>;
}
