import type { FileSystem } from "../file_system.ts";
import { makeContentsURL } from "./urls.ts";

export interface GitHubFileSystemOptions {
  /**
   * The GitHub repository in the format `owner/repo`.
   */
  repo: string;

  /**
   * The commit message.
   */
  message: string;

  /**
   * Required if you are updating a file.
   *
   * The blob SHA of the file being replaced.
   */
  sha?: string;

  /**
   * The person that committed the file. Default: the authenticated user.
   */
  committer?: {
    /**
     * The name of the author or committer of the commit. You'll receive a `422` status code if `name` is omitted.
     */
    name: string;

    /**
     * The email of the author or committer of the commit. You'll receive a `422` status code if `email` is omitted.
     */
    email: string;

    /**
     * The date of the commit. You can provide either a valid ISO 8601 date or a UNIX timestamp. If you don't provide a date, the API will use the current time. You'll receive a `422` status code if `date` is omitted.
     */
    date?: string;
  };

  /**
   * The author of the file. Default: The `committer` or the authenticated user if you omit `committer`.
   */
  author?: {
    /**
     * The name of the author or committer of the commit. You'll receive a `422` status code if `name` is omitted.
     */
    name: string;

    /**
     * The email of the author or committer of the commit. You'll receive a `422` status code if `email` is omitted.
     */
    email: string;

    /**
     * The date of the commit. You can provide either a valid ISO 8601 date or a UNIX timestamp. If you don't provide a date, the API will use the current time. You'll receive a `422` status code if `date` is omitted.
     */
    date?: string;
  };

  /**
   * The GitHub personal access token.
   */
  token?: string;
}

export class GitHubFileSystem implements FileSystem {
  constructor(public readonly options: GitHubFileSystemOptions) {}

  /**
   * Get the content of a file on GitHub.
   */
  public async read(file: string): Promise<string | undefined> {
    const url = makeContentsURL(this.options.repo, file);
    const headers = new Headers({
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json",
    });
    const response = await fetch(url, { headers });
    const json = await response.json();
    console.log("read", { json });
    if (json.message === "Not Found") {
      return undefined;
    }

    return atob(json.content);
  }

  /**
   * Set the content of a file on GitHub.
   *
   * @see https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
   */
  public async write(
    file: string,
    content: string,
  ): Promise<void> {
    const url = makeContentsURL(this.options.repo, file);
    const headers = new Headers({
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json",
    });
    const body = JSON.stringify({
      content: btoa(content),
    });
    const response = await fetch(url, { method: "PUT", headers, body });
    const json = await response.json();
    console.log("write", { json });
  }

  /**
   * Delete a file on GitHub.
   *
   * @see https://docs.github.com/en/rest/reference/repos#delete-a-file
   */
  public async delete(file: string): Promise<void> {
    const url = makeContentsURL(this.options.repo, file);
    const headers = new Headers({
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json",
    });
    const body = JSON.stringify({
      message: "Created by deno-codemod",
      content: "",
    });
    const response = await fetch(url, { method: "DELETE", headers, body });
    const json = await response.json();
    console.log("delete", { json });
  }
}
