import type { JSONPatchOperation } from "../deps.ts";
import { applyJSONPatch } from "../deps.ts";
import type { CodemodClientInterface } from "../client_interface.ts";
import { Client as BaseClient } from "../client.ts";
import type { Options } from "./options.ts";
import { encode } from "./deps.ts";
import { makeContentsURL, makePRURL } from "./urls.ts";

type Op<T> = () => Promise<OpResult<T>>;

interface OpResult<T> {
  response: Response;
  data: T;
}

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
  private makeTouchOp(file: string): () => Promise<Response> {
    const readOp = this.makeReadOp(file).bind(this);
    const setOp = this.makeSetOp(file, "").bind(this);
    const op = () =>
      readOp()
        .then((res) => res.ok ? res : setOp());

    return op;
  }

  private makeSetOp(file: string, content: string): () => Promise<Response> {
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

  private makeReadOp(file: string): () => Promise<string> {
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
        .then(async (res: Response) => {
          if (!res.ok) {
            throw new Error(`Failed to read ${file}`);
          }

          // Continue if the file doesn't exist.
          const json = await res.json();
          console.log({ json });
          return "";
        });
    return op;
  }

  private makePROp(
    title: string,
    body: string,
    head: string,
    base: string,
  ): () => Promise<Response> {
    const url = makePRURL(this.options.repo);
    const headers = new Headers({
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${this.options.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/x-www-form-urlencoded",
    });
    const op = () =>
      fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ title, body, head, base }),
      });
    return op;
  }
}
