import type { GitHubAPIRefsPostRequest } from "./api/mod.ts";

/**
 * GitHubCreateBranchBuilderInterface is an interface for a
 * GitHubCreateBranchBuilder.
 */
export interface GitHubCreateBranchBuilderInterface {
  /**
   * run executes the builder.
   */
  run(): GitHubAPIRefsPostRequest;
}
