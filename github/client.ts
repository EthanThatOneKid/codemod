/**
 * Options for a commit.
 *
 * @see https://docs.github.com/en/rest/git/commits?apiVersion=2022-11-28#create-a-commit
 */
interface CommitOptions {
  /**
   * The commit message.
   */
  message: string;

  /**
   * The SHA of the tree object this commit points to.
   */
  tree: string;

  /**
   * The SHAs of the commits that were the parents of this commit. If omitted
   * or empty, the commit will be written as a root commit. For a single
   * parent, an array of one SHA should be provided; for a merge commit, an
   * array of more than one should be provided.
   */
  parents?: string[];

  /**
   * Information about the author of the commit. By default, the `author`
   * will be the authenticated user and the current date. See the `author`
   * and `committer` object below for details.
   */
  author?: {
    /**
     * The name of the author (or committer) of the commit.
     */
    name: string;

    /**
     * The email of the author (or committer) of the commit.
     */
    email: string;

    /**
     * Indicates when this commit was authored (or committed). This is a
     * timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format:
     * `YYYY-MM-DDTHH:MM:SSZ`.
     */
    date?: string;
  };

  /**
   * Information about the person who is making the commit. By default,
   * `committer` will use the information set in `author`. See the `author`
   * and `committer` object below for details.
   */
  committer?: {
    /**
     * The name of the author (or committer) of the commit.
     */
    name?: string;

    /**
     * The email of the author (or committer) of the commit.
     */
    email?: string;

    /**
     * Indicates when this commit was authored (or committed). This is a
     * timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format:
     * `YYYY-MM-DDTHH:MM:SSZ`.
     */
    date?: string;
  };

  /**
   * The [PGP signature](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) of the commit.
   *
   * @see https://docs.github.com/en/rest/git/commits?apiVersion=2022-11-28#create-a-commit
   */
  signature?: string;
}
