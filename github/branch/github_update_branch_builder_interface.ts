import type { GitHubAPIRefPatchRequest } from "../api/mod.ts";
import type { Generate } from "../shared/generate.ts";

/**
 * GitHubUpdateBranchBuilderInterface is an interface for a
 * GitHubUpdateBranchBuilder.
 *
 * @see https://docs.github.com/en/rest/reference/git#update-a-reference
 */
export interface GitHubUpdateBranchBuilderInterface {
  /**
   * run executes the builder.
   */
  run(): Promise<GitHubAPIRefPatchRequest>;

  /**
   * sha sets the commit or tree SHA.
   */
  sha(shaOrSHAGenerate: Generate<string, []>): this;

  /**
   * ref sets the ref.
   */
  ref(refOrRefGenerate: Generate<string, []>): this;

  /**
   * force sets the force flag. If empty, the force flag is set to true.
   */
  force(forceOrForceGenerate?: Generate<boolean, []>): this;
}
