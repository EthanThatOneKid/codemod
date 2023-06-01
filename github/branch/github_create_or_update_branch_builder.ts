import type { GitHubAPIRefPatchResponse } from "../api/github_api_client_interface.ts";
import type { GitHubCreateOrUpdateBranchBuilderInterface } from "./github_create_or_update_branch_builder_interface.ts";

/**
 * GitHubCreateOrUpdateBranchBuilder is a builder to build a
 */
export interface GitHubCreateOrUpdateBranchBuilder implements 
  GitHubCreateOrUpdateBranchBuilderInterface {
  /**
   * run executes the builder.
   */
  run(): Promise<GitHubAPIRefPatchResponse> {
    throw new Error("Not implemented");
  }
}