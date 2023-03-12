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
    // deno-lint-ignore no-explicit-any
    replacer?: ((this: any, key: string, value: any) => any) | undefined,
    space?: string | number | undefined,
  ): Promise<void>;
  delete(file: string): Promise<void>;
}
