import { applyJSONPatch } from "./deps.ts";
import type { JSONPatchOperation } from "./deps.ts";
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
import { diffCharacters } from "./deps.ts";

export abstract class Client {
  async do(codemods: CodemodInput[]): Promise<CodemodOutput[]> {
    const results: CodemodOutput[] = [];
    for (const codemod of codemods) {
      for (const file of codemod.files) {
        let r: CodemodOutput;
        // Note: Update this switch statement when new codemod types are added.
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

  public async touch(file: string): Promise<CodemodOutput> {
    await Deno.create(file);
    return makeTouchCodemodResult(file);
  }

  public async set(file: string, content: string): Promise<CodemodOutput> {
    const originalContent = await Deno.readTextFile(file);
    await Deno.writeTextFile(file, content);
    return makeSetCodemodResult(file, content, originalContent, content);
  }

  public async append(file: string, content: string): Promise<CodemodOutput> {
    const originalContent = await Deno.readTextFile(file);
    const newContent = originalContent + content;
    await Deno.writeTextFile(file, newContent);
    return makeAppendCodemodResult(file, content, originalContent, newContent);
  }

  public async prepend(file: string, content: string): Promise<CodemodOutput> {
    const originalContent = await Deno.readTextFile(file);
    const newContent = content + originalContent;
    await Deno.writeTextFile(file, newContent);
    return makePrependCodemodResult(file, content, originalContent, newContent);
  }

  public async replace(
    file: string,
    regex: RegExp,
    replaceWith: string,
  ): Promise<CodemodOutput> {
    const originalContent = await Deno.readTextFile(file);
    const newContent = originalContent.replace(regex, replaceWith);
    await Deno.writeTextFile(file, newContent);
    return makeReplaceCodemodResult(
      file,
      regex,
      replaceWith,
      originalContent,
      newContent,
    );
  }

  public async jsonpatch(
    file: string,
    patch: readonly JSONPatchOperation[],
    replacer?: Parameters<typeof JSON.stringify>[1],
    space?: Parameters<typeof JSON.stringify>[2],
  ): Promise<CodemodOutput> {
    const originalContent = await Deno.readTextFile(file);
    const originalJSON = JSON.parse(originalContent);
    const newJSON = applyJSONPatch(originalJSON, patch);
    const newContent = JSON.stringify(newJSON, replacer, space);
    await Deno.writeTextFile(file, newContent);
    return makeJSONPatchCodemodResult(
      file,
      patch,
      originalContent,
      newContent,
    );
  }

  public async delete(file: string): Promise<CodemodOutput> {
    const originalContent = await Deno.readTextFile(file);
    await Deno.remove(file);
    return makeDeleteCodemodResult(file, originalContent, "");
  }

  /** Returns an array representing how the strings are different. */
  static diff(a: string, b: string): DiffCharacter[] {
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
}

function makeCodemodResult(
  file: string,
  codemod: Codemod,
  unchanged: string,
  changed: string,
): CodemodOutput {
  const diff = Client.diff(unchanged, changed);
  return { file, diff, ...codemod };
}

function makeTouchCodemodResult(file: string): CodemodOutput {
  const codemod: TouchCodemod = { type: CodemodType.TOUCH };
  return makeCodemodResult(file, codemod, "", "");
}

function makeSetCodemodResult(
  file: string,
  content: string,
  unchanged: string,
  changed: string,
): CodemodOutput {
  const codemod: SetCodemod = {
    type: CodemodType.SET,
    content,
  };
  return makeCodemodResult(file, codemod, unchanged, changed);
}

function makeAppendCodemodResult(
  file: string,
  content: string,
  unchanged: string,
  changed: string,
): CodemodOutput {
  const codemod: AppendCodemod = {
    type: CodemodType.APPEND,
    content,
  };
  return makeCodemodResult(file, codemod, unchanged, changed);
}

function makePrependCodemodResult(
  file: string,
  content: string,
  unchanged: string,
  changed: string,
): CodemodOutput {
  const codemod: PrependCodemod = {
    type: CodemodType.PREPEND,
    content,
  };
  return makeCodemodResult(file, codemod, unchanged, changed);
}

function makeReplaceCodemodResult(
  file: string,
  regex: RegExp,
  replaceWith: string,
  unchanged: string,
  changed: string,
): CodemodOutput {
  const codemod: ReplaceCodemod = {
    type: CodemodType.REPLACE,
    regex,
    replaceWith,
  };
  return makeCodemodResult(file, codemod, unchanged, changed);
}

function makeJSONPatchCodemodResult(
  file: string,
  patch: readonly JSONPatchOperation[],
  unchanged: string,
  changed: string,
): CodemodOutput {
  const codemod: JSONPatchCodemod = {
    type: CodemodType.JSONPATCH,
    patch,
  };
  return makeCodemodResult(file, codemod, unchanged, changed);
}

function makeDeleteCodemodResult(
  file: string,
  unchanged: string,
  changed: string,
): CodemodOutput {
  const codemod: DeleteCodemod = { type: CodemodType.DELETE };
  return makeCodemodResult(file, codemod, unchanged, changed);
}
