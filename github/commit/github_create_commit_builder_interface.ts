import type { GitHubAPICommitsPostRequest } from "../api/mod.ts";
import type { Generate } from "../shared/generate.ts";

/**
 * GitHubCreateCommitBuilderInterface is an interface for a
 * GitHubCreateCommitBuilder.
 *
 * @see https://docs.github.com/en/rest/reference/git#create-a-commit
 */
export interface GitHubCreateCommitBuilderInterface {
  /**
   * run executes the builder.
   */
  run(): Promise<GitHubAPICommitsPostRequest>;

  /**
   * message sets the commit message.
   */
  message(messageOrMessageGenerate: Generate<string, []>): this;

  /**
   * tree sets the tree SHA.
   */
  tree(shaOrSHAGenerate: Generate<string, []>): this;

  /**
   * parents sets the parent SHAs.
   */
  parents(shasOrSHAsGenerate: Generate<string[], []>): this;

  /**
   * parentRef sets the parent to the specified ref.
   *
   * Subsequent calls to parent will override the previous value.
   */
  parentRef(
    parentRefOrParentGenerate: Generate<string | undefined | null, []>,
    ...fallbackRefs: Generate<string | undefined, []>[]
  ): this;

  /**
   * author sets the author.
   */
  author(
    authorOrAuthorGenerate: Generate<GitHubAPICommitsPostRequest["author"], []>,
  ): this;

  /**
   * committer sets the committer.
   */
  committer(
    committerOrCommitterGenerate: Generate<
      GitHubAPICommitsPostRequest["committer"],
      []
    >,
  ): this;

  /**
   * signature sets the signature.
   */
  signature(signatureOrSignatureGenerate: Generate<string, []>): this;
}
