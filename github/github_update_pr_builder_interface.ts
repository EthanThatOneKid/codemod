import type { GitHubAPIPullPatchResponse } from "./api/mod.ts";

/**
 * GitHubCodemodUpdatePRBuilderInterface is an interface for a GitHubCodemodUpdatePRBuilder.
 *
 * @see https://docs.github.com/en/rest/reference/git#update-a-pull-request
 */
export interface GitHubCodemodUpdatePRBuilderInterface {
  /**
   * run executes the builder.
   */
  run(): GitHubAPIPullPatchResponse;
}
