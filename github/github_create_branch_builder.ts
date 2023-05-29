import type { GitHubAPIRefsPostRequest } from "./api/github_api_client_interface.ts";
import type { GitHubCreateBranchBuilderInterface } from "./github_create_branch_builder_interface.ts";

/**
 * GitHubCodemodCreateBranchBuilder is a builder for a
 * GitHubCodemodCreateBranch.
 */
export class GitHubCodemodCreateBranchBuilder
  implements GitHubCreateBranchBuilderInterface {
  constructor(
    private readonly options: GitHubAPIRefsPostRequest,
  ) {}

  run(): GitHubAPIRefsPostRequest {
    return this.options;
  }
}
