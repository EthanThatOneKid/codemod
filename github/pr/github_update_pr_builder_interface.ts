import type { GitHubAPIPullPatchRequest } from "../api/mod.ts";
import type { Generate } from "../shared/generate.ts";

/**
 * GitHubUpdatePRBuilderInterface is an interface for a
 * GitHubCodemodUpdatePRBuilder.
 *
 * @see https://docs.github.com/en/rest/pulls/pulls#update-a-pull-request
 */
export interface GitHubUpdatePRBuilderInterface {
  /**
   * run executes the builder.
   */
  run(): Promise<GitHubAPIPullPatchRequest>;

  /**
   * title sets the title of the pull request.
   */
  title(titleOrTitleGenerate: Generate<string | undefined, []>): this;

  /**
   * body sets the body of the pull request.
   */
  body(bodyOrBodyGenerate: Generate<string | undefined, []>): this;

  /**
   * state sets the state of the pull request.
   */
  state(
    stateOrStateGenerate: Generate<GitHubAPIPullPatchRequest["state"], []>,
  ): this;

  /**
   * base sets the base of the pull request.
   */
  base(baseOrBaseGenerate: Generate<string, []>): this;

  /**
   * head sets the head of the pull request.
   */
  head(headOrHeadGenerate: Generate<string, []>): this;

  /**
   * maintainerCanModify sets the maintainer_can_modify of the pull request.
   */
  maintainerCanModify(
    maintainerCanModifyOrMaintainerCanModifyGenerate: Generate<
      boolean | undefined,
      []
    >,
  ): this;
}
