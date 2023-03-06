import type { CodemodClient } from "../types.ts";

export class Client implements CodemodClient {
  constructor(
    /**
     * The "owner/name" string of the repository.
     */
    public readonly repo: string,
    /**
     * The current branch to use.
     */
    public readonly branch: string,
    /**
     * The target branch to use.
     */
    public readonly targetBranch: string,
    /**
     * The GitHub token to use.
     */
    public readonly token: string,
    /**
     * The commit to send to GitHub.
     */
    public readonly commit: {
      /**
       * The commit message to use.
       */
      message: string;
      /**
       * The commit author to use.
       */
      committer: {
        /**
         * The GitHub username to use.
         */
        name: string;
        /**
         * The GitHub email to use.
         */
        email: string;
      };
    },
  ) {}

  /**
   * Create a blank file if it doesn't exist on GitHub.
   *
   * @see https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
   */
  public async touch(file: string): Promise<void> {
    console.log("touch", file);
    return;
  }

  /**
   * Set the content of a file on GitHub.
   *
   * @see https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
   */
  public async set(file: string, content: string): Promise<void> {
    console.log("set", file, content);
    return;
  }

  /**
   * Append content to a file on GitHub.
   *
   * @see https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
   */
  public async append(file: string, content: string): Promise<void> {
    console.log("append", file, content);
    return;
  }

  /**
   * Prepend content to a file on GitHub.
   *
   * @see https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
   */
  public async prepend(file: string, content: string): Promise<void> {
    console.log("prepend", file, content);
    return;
  }

  /**
   * Replace content in a file on GitHub.
   *
   * @see https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
   */
  public async replace(
    file: string,
    regex: RegExp,
    replaceWith: string,
  ): Promise<void> {
    console.log("replace", file, regex, replaceWith);
    return;
  }

  /**
   * Delete a file on GitHub.
   *
   * @see https://docs.github.com/en/rest/repos/contents#delete-a-file
   */
  public async delete(file: string): Promise<void> {
    console.log("delete", file);
    return;
  }
}
