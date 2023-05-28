import type { GitHubAPIRefPatchRequest } from "./api/mod.ts";

/**
 * GitHubCodemodUpdateBranchBuilderInterface is an interface for a GitHubCodemodUpdateBranchBuilder.
 *
 * @see https://docs.github.com/en/rest/reference/git#update-a-reference
 */
export interface GitHubCodemodUpdateBranchBuilderInterface {
  /**
   * run executes the builder.
   */
  run(): GitHubAPIRefPatchRequest;
}
