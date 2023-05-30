import type { GitHubAPIPullsPostRequest } from "./api/mod.ts";

/**
 * GitHubCodemodCreatePRBuilderInterface is an interface for a
 * GitHubCodemodCreatePRBuilder.
 *
 * @see https://docs.github.com/en/rest/reference/git#create-a-pull-request
 */
export interface GitHubCodemodCreatePRBuilderInterface {
  /**
   * run executes the builder.
   */
  run(): GitHubAPIPullsPostRequest;
}
