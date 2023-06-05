import type { GitHubAPIRefPatchRequest } from "../api/mod.ts";
import type { Generate } from "../shared/generate.ts";
import { generateObject } from "../shared/generate.ts";
import type { GitHubUpdateBranchBuilderInterface } from "./github_update_branch_builder_interface.ts";

/**
 * GitHubUpdateBranchBuilder is a builder for a
 * GitHub branch update operation.
 */
export class GitHubUpdateBranchBuilder
  implements GitHubUpdateBranchBuilderInterface {
  #ref: Generate<string, []>;
  #sha: Generate<string, []>;
  #force: Generate<boolean, []>;

  constructor(options: GitHubAPIRefPatchRequest) {
    this.#ref = options.ref;
    this.#sha = options.sha;
    this.#force = options.force ?? false;
  }

  public ref(refOrRefGenerate: Generate<string, []>): this {
    this.#ref = refOrRefGenerate;
    return this;
  }

  public sha(shaOrSHAGenerate: Generate<string, []>): this {
    this.#sha = shaOrSHAGenerate;
    return this;
  }

  public force(forceOrForceGenerate: Generate<boolean, []>): this {
    this.#force = forceOrForceGenerate;
    return this;
  }

  public run(): Promise<GitHubAPIRefPatchRequest> {
    return generateObject({
      ref: this.#ref,
      sha: this.#sha,
      force: this.#force,
    }, {
      ref: [],
      sha: [],
      force: [],
    });
  }
}
