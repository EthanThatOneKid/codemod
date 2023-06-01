import type { GitHubAPIPullsPostRequest } from "../api/mod.ts";

/**
 * GitHubCreatePRBuilderInterface is an interface for a
 * GitHubCreatePRBuilderInterface.
 *
 * @see https://docs.github.com/en/rest/reference/git#create-a-pull-request
 */
export interface GitHubCreatePRBuilderInterface {
  /**
   * run executes the builder.
   */
  run(): GitHubAPIPullsPostRequest;
}
