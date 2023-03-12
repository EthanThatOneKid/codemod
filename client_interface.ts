import type { JSONPatchOperation } from "./deps.ts";
import type { Codemod } from "./codemod.ts";

/**
 * The interface for a codemod client.
 */
export interface CodemodClientInterface {
  do(codemod: Codemod): Promise<void>;
  touch(file: string): Promise<void>;
  set(file: string, content: string): Promise<void>;
  append(file: string, content: string): Promise<void>;
  prepend(file: string, content: string): Promise<void>;
  replace(file: string, regex: RegExp, replaceWith: string): Promise<void>;
  jsonpatch(
    file: string,
    patch: ReadonlyArray<JSONPatchOperation>,
    replacer?: Parameters<typeof JSON.stringify>[1],
    space?: Parameters<typeof JSON.stringify>[2],
  ): Promise<void>;
  delete(file: string): Promise<void>;
}
