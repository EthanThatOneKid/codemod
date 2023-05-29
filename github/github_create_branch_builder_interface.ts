import type { GitHubAPIRefsPostRequest } from "./api/mod.ts";
import type { Generate } from "./types.ts";

/**
 * GitHubCreateBranchBuilderInterface is an interface for a
 * GitHubCreateBranchBuilder.
 *
 * @see https://docs.github.com/en/rest/reference/git#create-a-reference
 */
export interface GitHubCreateBranchBuilderInterface {
  /**
   * run executes the builder.
   */
  run(): Promise<GitHubAPIRefsPostRequest>;

  /**
   * clone clones the builder.
   */
  clone(): this;

  /**
   * ref sets the ref.
   */
  ref(refOrRefGenerate: Generate<string, []>): this;

  /**
   * sha sets the commit or tree SHA.
   */
  sha(shaOrSHAGenerate: Generate<string, []>): this;
}
