import type { GitHubAPIPullsPostRequest } from "../api/mod.ts";
import type { Generate } from "../shared/generate.ts";

/**
 * GitHubCreatePRBuilderInterface is an interface for a
 * GitHubCreatePRBuilderInterface.
 *
 * @see https://docs.github.com/en/rest/reference/git#create-a-pull-request
 */
export interface GitHubCreatePRBuilderInterface {
  /**
   * run executes the builder.
   */
  run(): Promise<GitHubAPIPullsPostRequest>;

  /**
   * title sets the title of the pull request.
   */
  title(titleOrTitleGenerate: Generate<string | undefined, []>): this;

  /**
   * head sets the head of the pull request.
   */
  head(headOrHeadGenerate: Generate<string, []>): this;

  /**
   * headRepo sets the head repo of the pull request.
   */
  headRepo(
    headRepoOrHeadRepoGenerate: Generate<string | undefined, []>,
  ): this;

  /**
   * base sets the base of the pull request.
   */
  base(baseOrBaseGenerate: Generate<string, []>): this;

  /**
   * body sets the body of the pull request.
   */
  body(bodyOrBodyGenerate: Generate<string | undefined, []>): this;

  /**
   * maintainerCanModify sets the maintainerCanModify of the pull request.
   */
  maintainerCanModify(
    maintainerCanModifyOrMaintainerCanModifyGenerate: Generate<
      boolean | undefined,
      []
    >,
  ): this;

  /**
   * draft sets the draft of the pull request.
   */
  draft(draftOrDraftGenerate: Generate<boolean | undefined, []>): this;

  /**
   * issue sets the issue of the pull request.
   */
  issue(issueOrIssueGenerate: Generate<number | undefined, []>): this;
}
