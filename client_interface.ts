import type { JSONPatchOperation } from "./deps.ts";
import type { Codemod } from "./codemod.ts";

/**
 * The interface for a codemod client.
 */
export interface CodemodClientInterface {
  do(codemods: Codemod[]): Promise<Response[]>;

  touch(file: string): Promise<Response>;
  set(file: string, content: string): Promise<Response>;
  append(file: string, content: string): Promise<Response>;
  prepend(file: string, content: string): Promise<Response>;
  replace(file: string, regex: RegExp, replaceWith: string): Promise<Response>;
  jsonpatch(
    file: string,
    patch: ReadonlyArray<JSONPatchOperation>,
    replacer?: Parameters<typeof JSON.stringify>[1],
    space?: Parameters<typeof JSON.stringify>[2],
  ): Promise<Response>;
  delete(file: string): Promise<Response>;
}
