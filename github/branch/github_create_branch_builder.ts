import type { GitHubAPIRefsPostRequest } from "../api/mod.ts";
import type { Generate } from "../shared/generate.ts";
import { generateObject } from "../shared/generate.ts";
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

  public run(): Promise<GitHubAPIRefsPostRequest> {
    return generateObject({
      ref: this.#ref,
      sha: this.#sha,
    }, {
      ref: [],
      sha: [],
    });
  }
}
