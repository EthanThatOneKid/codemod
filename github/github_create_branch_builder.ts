import type { GitHubAPIRefsPostRequest } from "./api/github_api_client_interface.ts";
import type { Generate } from "./generate.ts";
import { generateObject } from "./generate.ts";
import type { GitHubCreateBranchBuilderInterface } from "./github_create_branch_builder_interface.ts";

/**
 * GitHubCodemodCreateBranchBuilder is a builder for a
 * GitHubCodemodCreateBranch.
 */
export class GitHubCodemodCreateBranchBuilder
  implements GitHubCreateBranchBuilderInterface {
  #ref: Generate<string, []>;
  #sha: Generate<string, []>;

  constructor(options: GitHubAPIRefsPostRequest) {
    this.#ref = options.ref;
    this.#sha = options.sha;
  }

  public ref(refOrRefGenerate: Generate<string, []>): this {
    this.#ref = refOrRefGenerate;
    return this;
  }

  public sha(shaOrSHAGenerate: Generate<string, []>): this {
    this.#sha = shaOrSHAGenerate;
    return this;
  }

  public async run(): Promise<GitHubAPIRefsPostRequest> {
    return await generateObject({
      ref: this.#ref,
      sha: this.#sha,
    }, {
      ref: [],
      sha: [],
    });
  }
}
