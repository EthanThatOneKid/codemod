import type { Codemod } from "../codemod.ts";
import type {
  CreatePROptions,
  GetRepositoryContentOptions,
  GitHubClientInterface,
} from "./client_interface.ts";
import { makeContentsURL, makePRURL } from "./urls.ts";

import type { JSONPatchOperation } from "../deps.ts";
// import { applyJSONPatch } from "../deps.ts";
// import type { CodemodClientInterface } from "../client_interface.ts";
// import { Client as BaseClient } from "../client.ts";
// import type { Options } from "./options.ts";
import { decode, encode } from "./deps.ts";
// import { makeContentsURL, makePRURL } from "./urls.ts";

export class GitHubClient implements GitHubClientInterface {
  constructor(
    /** The repository in the form of `owner/repo`. */
    public readonly repo: string,
  ) {}

  public async pr(options: CreatePROptions): Promise<Response> {
    const url = makePRURL(`${options.owner}/${options.repo}`);
    const headers = new Headers({
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json",
    });
    const body = JSON.stringify(options);
    return await fetch(url, {
      method: "POST",
      headers,
      body,
    });
  }

  public async read(file: string, branch?: string): Promise<Response> {
    const url = makeContentsURL(this.repo, file, branch);
    const headers = new Headers({
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json",
    });
    return await fetch(url, { headers });
  }

  async do(codemods: Codemod[]): Promise<Response[]> {
    const responses: Response[] = [];
    for (const codemod of codemods) {
      for (const file of codemod.files) {
        let r: Response;
        switch (codemod.type) {
          case "touch": {
            r = await this.touch(file);
            break;
          }
          case "set": {
            r = await this.set(file, codemod.content);
            break;
          }
          case "append": {
            r = await this.append(file, codemod.content);
            break;
          }
          case "prepend": {
            responses.push(this.prepend(file, codemod.content));
            break;
          }
          case "replace": {
            responses.push(
              this.replace(file, codemod.regex, codemod.replaceWith),
            );
            break;
          }
          case "jsonpatch": {
            responses.push(
              this.jsonpatch(
                file,
                codemod.patch,
                codemod.replacer,
                codemod.space,
              ),
            );
            break;
          }
          case "delete": {
            responses.push(this.delete(file));
            break;
          }
          default: {
            throw new Error(`Invalid codemod: "${JSON.stringify(codemod)}"`);
          }
        }

        responses.push(r!);
        if (!r!.ok) {
          throw new Error(`Request failed: ${r!.status} ${r!.statusText}`);
        }
      }
    }
  }

  public async touch(file: string): Promise<Response> {
    const data = await fromRead(this.read({
      owner: this.owner,
    }));
  }

  set(file: string, content: string): Promise<Response> {
    throw new Error("Method not implemented.");
  }

  append(file: string, content: string): Promise<Response> {
    throw new Error("Method not implemented.");
  }

  prepend(file: string, content: string): Promise<Response> {
    throw new Error("Method not implemented.");
  }

  replace(file: string, regex: RegExp, replaceWith: string): Promise<Response> {
    throw new Error("Method not implemented.");
  }

  jsonpatch(
    file: string,
    patch: readonly JSONPatchOperation[],
    replacer?: (string | number)[] | null | undefined,
    space?: string | number | undefined,
  ): Promise<Response> {
    throw new Error("Method not implemented.");
  }

  delete(file: string): Promise<Response> {
    throw new Error("Method not implemented.");
  }
}

export async function fromRead(promise: Promise<Response>): Promise<string> {
  const response = await promise;
  const json = await response.json();
  const content = json.content;
  if (!content) {
    throw new Error(`No content in response: ${JSON.stringify(json)}`);
  }

  const decoded = decode(content);
  return decoded;
}
