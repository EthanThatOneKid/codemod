import type { JSONPatchOperation } from "../deps.ts";
import { applyJSONPatch } from "../deps.ts";
import type { CodemodClientInterface } from "../client_interface.ts";
import { Client as BaseClient } from "../client.ts";
import type { Options } from "./options.ts";
import { encode } from "./deps.ts";
import { makeContentsURL, makePRURL } from "./urls.ts";

export class Client extends BaseClient implements CodemodClientInterface {
  constructor(
    public readonly options: Options,
  ) {
    super();
  }

  /**
   * Create a blank file if it doesn't exist on GitHub.
   */
  public async touch(file: string): Promise<void> {
    await this.makeTouchOp(file);
    return;
  }

  /**
   * Set the content of a file on GitHub.
   *
   * @see https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
   */
  public async set(file: string, content: string): Promise<void> {
    await this.makeSetOp(file, content);
    return;
  }

  /**
   * Append content to a file on GitHub.
   */
  public async append(file: string, content: string): Promise<void> {
    console.log("append", file, content);
    return;
  }

  /**
   * Prepend content to a file on GitHub.
   */
  public async prepend(file: string, content: string): Promise<void> {
    console.log("prepend", file, content);
    return;
  }

  /**
   * Replace content in a file on GitHub.
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
   * Patch a file on GitHub.
   */
  public async jsonpatch(
    file: string,
    patch: readonly JSONPatchOperation[],
    // deno-lint-ignore no-explicit-any
    replacer?: ((this: any, key: string, value: any) => any) | undefined,
    space?: string | number | undefined,
  ): Promise<void> {
    await this.makeJSONPatchOp(file, patch, replacer, space);
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

  // Return readOp response if it fails, otherwise return setOp response.
  private makeTouchOp(file: string): Op {
    const readOp = this.makeReadOp(file).bind(this);
    const setOp = this.makeSetOp(file, "").bind(this);
    const op = () =>
      readOp()
        .then(({ response, data: content }) => {
          if (response.ok && content.length > 0) {
            throw new Error(`File ${file} already exists`);
          }
        })
        .then(setOp);
    return op;
  }

  private makeSetOp(file: string, content: string): Op {
    const prOp = this.makePROp(
      this.options.pr.title,
      this.options.pr.body,
      this.options.commit.head,
      this.options.pr.base,
    ).bind(this);

    const url = makeContentsURL(
      this.options.repo,
      this.options.commit.head,
      file,
    );
    const body = JSON.stringify({
      ...this.options.commit,
      content: encode(content),
    });
    const headers = new Headers({
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${this.options.token}`,
      "Content-Type": "application/json",
      "X-Github-Api-Version": "2022-11-28",
    });
    const op = () => (
      fetch(url, {
        method: "PUT",
        body,
        headers,
      })
        .then(prOp)
    );
    return op;
  }

  private makeJSONPatchOp(
    file: string,
    patch: readonly JSONPatchOperation[],
    // deno-lint-ignore no-explicit-any
    replacer?: ((this: any, key: string, value: any) => any) | undefined,
    space?: string | number | undefined,
  ): () => Promise<Response> {
    return async () => Response.error();
  }

  // Maybe set up retries for this?
  // https://deno.land/std/async/retry.ts?s=retry
  private makeReadOp(file: string): Op<string> {
    const url = makeContentsURL(
      this.options.repo,
      this.options.commit.head,
      file,
    );
    const headers = new Headers({
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${this.options.token}`,
      "Content-Type": "application/json",
    });
    const op = () =>
      fetch(url, { headers })
        .then(async (response: Response) => {
          if (!response.ok) {
            throw new Error(`Failed to read ${file}`);
          }

          // Continue if the file doesn't exist.
          const json = await response.json();
          console.log({ json });
          return { response: response, data: json.content };
        });
    return op;
  }

  private makePROp(): Op {
    const url = makePRURL(this.options.repo);
    const headers = new Headers({
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${this.options.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/x-www-form-urlencoded",
    });
    const body = JSON.stringify({
      title: this.options.pr.title,
      body: this.options.pr.body,
      head: this.options.commit.head,
      base: this.options.pr.base,
    });
    const op = () =>
      fetch(url, { method: "POST", headers, body })
        .then((response) => ({ response }));
    return op;
  }
}
