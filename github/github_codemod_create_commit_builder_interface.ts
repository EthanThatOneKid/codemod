import type { GitHubAPICommitsPostRequest } from "./api/mod.ts";

/**
 * GitHubCodemodCreateCommitBuilderInterface is an interface for a
 * GitHubCodemodCreateCommitBuilder.
 */
export interface GitHubCodemodCreateCommitBuilderInterface {
  /**
   * run executes the builder.
   */
  run(): Promise<GitHubAPICommitsPostRequest>;
}
