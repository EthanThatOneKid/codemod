import type { JSONPatchOperation } from "../deps.ts";
import type { CodemodClient } from "../types.ts";
import { applyJSONPatch } from "../deps.ts";

export class Client implements CodemodClient {
  public async touch(file: string): Promise<void> {
    await Deno.writeTextFile(file, "");
  }

  public async set(file: string, content: string): Promise<void> {
    await Deno.writeTextFile(file, content);
  }

  public async append(file: string, content: string): Promise<void> {
    await Deno.writeTextFile(file, content, { append: true });
  }

  public async prepend(file: string, content: string): Promise<void> {
    const originalContent = await Deno.readTextFile(file);
    await Deno.writeTextFile(file, content + originalContent);
  }

  public async replace(
    file: string,
    regex: RegExp,
    replaceWith: string,
  ): Promise<void> {
    const originalContent = await Deno.readTextFile(file);
    const newContent = originalContent.replace(regex, replaceWith);
    await Deno.writeTextFile(file, newContent);
  }

  public async jsonpatch(
    file: string,
    patch: JSONPatchOperation[],
  ): Promise<void> {
    const originalContent = await Deno.readTextFile(file);
    const originalJSON = JSON.parse(originalContent);
    const newJSON = applyJSONPatch(originalJSON, patch);
    const newContent = JSON.stringify(newJSON, null, 2);
    await Deno.writeTextFile(file, newContent);
  }

  public async delete(file: string): Promise<void> {
    await Deno.remove(file);
  }
}
