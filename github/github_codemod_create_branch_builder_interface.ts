import type { GitHubAPIRefsPostRequest } from "./api/mod.ts";

/**
 * GitHubCodemodCreateBranchBuilderInterface is an interface for a
 * GitHubCodemodCreateBranchBuilder.
 */
export interface GitHubCodemodCreateBranchBuilderInterface {
  /**
   * run executes the builder.
   */
  run(): GitHubAPIRefsPostRequest;
}
