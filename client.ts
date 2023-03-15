import type { JSONPatchOperation } from "./deps.ts";
import { applyJSONPatch, diffCharacters } from "./deps.ts";
import type {
  AppendCodemod,
  Codemod,
  CodemodInput,
  CodemodOutput,
  DeleteCodemod,
  DiffCharacter,
  JSONPatchCodemod,
  PrependCodemod,
  ReplaceCodemod,
  SetCodemod,
  TouchCodemod,
} from "./codemod.ts";
import { CodemodType, DiffType } from "./codemod.ts";

export abstract class Client {
  /**
   * Do a list of codemods.
   */
  async do(codemods: CodemodInput[]): Promise<CodemodOutput[]> {
    const results: CodemodOutput[] = [];
    for (const codemod of codemods) {
      for (const file of codemod.files) {
        let r: CodemodOutput;
        // Note: This switch statement must be changed whenever a new codemod type is added.
        switch (codemod.type) {
          case CodemodType.TOUCH: {
            r = await this.touch(file);
            break;
          }
          case CodemodType.SET: {
            r = await this.set(file, codemod.content);
            break;
          }
          case CodemodType.APPEND: {
            r = await this.append(file, codemod.content);
            break;
          }
          case CodemodType.PREPEND: {
            r = await this.prepend(file, codemod.content);
            break;
          }
          case CodemodType.REPLACE: {
            r = await this.replace(
              file,
              codemod.regex,
              codemod.replaceWith,
            );
            break;
          }
          case CodemodType.JSONPATCH: {
            r = await this.jsonpatch(
              file,
              codemod.patch,
              codemod.replacer,
              codemod.space,
            );
            break;
          }
          case CodemodType.DELETE: {
            r = await this.delete(file);
            break;
          }
          default: {
            throw new Error(`Invalid codemod: "${JSON.stringify(codemod)}"`);
          }
        }

        results.push(r);
      }
    }

    return results;
  }

  /**
   * Perform a touch codemod.
   */
  public async touch(file: string): Promise<CodemodOutput> {
    const original = await safelyReadTextFile(file);
    const output = Client.makeTouchCodemodOutput(file, original ?? "");
    if (original !== undefined) {
      return output;
    }

    return await safelyWriteTextFile(output);
  }

  /**
   * Perform a set codemod.
   */
  public async set(file: string, content: string): Promise<CodemodOutput> {
    const original = await safelyReadTextFile(file) ?? "";
    const output = Client.makeSetCodemodOutput(file, content, original);
    return await safelyWriteTextFile(output);
  }

  /**
   * Perform an append codemod.
   */
  public async append(file: string, content: string): Promise<CodemodOutput> {
    const original = await safelyReadTextFile(file) ?? "";
    const output = Client.makeAppendCodemodOutput(file, content, original);
    return await safelyWriteTextFile(output);
  }

  /**
   * Perform a prepend codemod.
   */
  public async prepend(file: string, content: string): Promise<CodemodOutput> {
    const original = await safelyReadTextFile(file) ?? "";
    const output = Client.makePrependCodemodOutput(file, content, original);
    return await safelyWriteTextFile(output);
  }

  /**
   * Perform a replace codemod.
   */
  public async replace(
    file: string,
    regex: RegExp,
    replaceWith: string,
  ): Promise<CodemodOutput> {
    const original = await safelyReadTextFile(file) ?? "";
    const output = Client.makeReplaceCodemodOutput(
      file,
      regex,
      replaceWith,
      original,
    );
    return await safelyWriteTextFile(output);
  }

  /**
   * Applies a JSON Patch to a JSON file.
   *
   * @remarks JSON Patch is specified in [RFC 6902](https://datatracker.ietf.org/doc/html/rfc6902/)
   * from the IETF.
   */
  public async jsonpatch(
    file: string,
    patch: readonly JSONPatchOperation[],
    replacer?: Parameters<typeof JSON.stringify>[1],
    space?: Parameters<typeof JSON.stringify>[2],
  ): Promise<CodemodOutput> {
    const original = await safelyReadTextFile(file) ?? "{}";
    const output = Client.makeJSONPatchCodemodOutput(
      file,
      patch,
      replacer,
      space,
      original,
    );
    return await safelyWriteTextFile(output);
  }

  public async delete(file: string): Promise<CodemodOutput> {
    const original = await safelyReadTextFile(file);
    const output = Client.makeDeleteCodemodOutput(file, original ?? "");
    if (original === undefined) {
      return output;
    }

    return await safelyDeleteFile(output);
  }

  /**
   * Returns an array representing how the strings are different.
   */
  public static diff(a: string, b: string): DiffCharacter[] {
    return diffCharacters(a, b)
      .map(({ wasAdded, wasRemoved, character }) => ({
        character,
        type: wasAdded
          ? DiffType.ADDED
          : wasRemoved
          ? DiffType.REMOVED
          : DiffType.UNCHANGED,
      }));
  }

  /**
   * Makes a CodemodOutput object from the given parameters.
   */
  protected static makeCodemodOutput(
    file: string,
    codemod: Codemod,
    unchanged: string,
    changed: string,
  ): CodemodOutput {
    const diff = Client.diff(unchanged, changed);
    return { file, unchanged, changed, diff, ...codemod };
  }

  /**
   * Makes a CodemodOutput for a touch codemod.
   */
  protected static makeTouchCodemodOutput(
    file: string,
    original: string,
  ): CodemodOutput {
    const codemod: TouchCodemod = { type: CodemodType.TOUCH };
    return Client.makeCodemodOutput(file, codemod, original, original);
  }

  /**
   * Makes a CodemodOutput for a set codemod.
   */
  protected static makeSetCodemodOutput(
    file: string,
    content: string,
    original: string,
  ): CodemodOutput {
    const codemod: SetCodemod = { type: CodemodType.SET, content };
    return Client.makeCodemodOutput(file, codemod, original, content);
  }

  /**
   * Makes a CodemodOutput for an append codemod.
   */
  protected static makeAppendCodemodOutput(
    file: string,
    content: string,
    original: string,
  ): CodemodOutput {
    const codemod: AppendCodemod = { type: CodemodType.APPEND, content };
    const modified = original + content;
    return Client.makeCodemodOutput(file, codemod, original, modified);
  }

  /**
   * Makes a CodemodOutput for a prepend codemod.
   */
  protected static makePrependCodemodOutput(
    file: string,
    content: string,
    original: string,
  ): CodemodOutput {
    const codemod: PrependCodemod = { type: CodemodType.PREPEND, content };
    const modified = content + original;
    return Client.makeCodemodOutput(file, codemod, original, modified);
  }

  /**
   * Makes a CodemodOutput for a replace codemod.
   */
  protected static makeReplaceCodemodOutput(
    file: string,
    regex: RegExp,
    replaceWith: string,
    original: string,
  ): CodemodOutput {
    const codemod: ReplaceCodemod = {
      type: CodemodType.REPLACE,
      regex,
      replaceWith,
    };
    const modified = original.replace(regex, replaceWith);
    return Client.makeCodemodOutput(file, codemod, original, modified);
  }

  /**
   * Makes a CodemodOutput for a JSON Patch codemod.
   */
  protected static makeJSONPatchCodemodOutput(
    file: string,
    patch: readonly JSONPatchOperation[],
    replacer: Parameters<typeof JSON.stringify>[1] | undefined,
    space: Parameters<typeof JSON.stringify>[2] | undefined,
    original: string,
  ): CodemodOutput {
    const codemod: JSONPatchCodemod = {
      type: CodemodType.JSONPATCH,
      patch,
      replacer,
      space,
    };
    const originalJSON = JSON.parse(original);
    const modified = JSON.stringify(
      applyJSONPatch(originalJSON, patch),
      replacer,
      space,
    );
    return Client.makeCodemodOutput(file, codemod, original, modified);
  }

  /**
   * Makes a CodemodOutput for a delete codemod.
   */
  protected static makeDeleteCodemodOutput(
    file: string,
    original: string,
  ): CodemodOutput {
    const codemod: DeleteCodemod = { type: CodemodType.DELETE };
    return Client.makeCodemodOutput(file, codemod, original, "");
  }
}

/**
 * Safely reads a text file via Deno API.
 *
 * @remarks This function is to be replaced in environments other than Deno.
 */
async function safelyReadTextFile(file: string): Promise<string | undefined> {
  try {
    return await Deno.readTextFile(file);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return;
    }
    throw error;
  }
}

/**
 * Safely writes a text file via Deno API.
 *
 * @remarks This function is to be replaced in environments other than Deno.
 */
async function safelyWriteTextFile(
  output: CodemodOutput,
): Promise<CodemodOutput> {
  try {
    await Deno.writeTextFile(output.file, output.changed);
    return output;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return output;
    }
    throw error;
  }
}

/**
 * Safely deletes a file via Deno API.
 *
 * @remarks This function is to be replaced in environments other than Deno.
 */
async function safelyDeleteFile(
  output: CodemodOutput,
): Promise<CodemodOutput> {
  try {
    await Deno.remove(output.file);
    return output;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return output;
    }
    throw error;
  }
}
