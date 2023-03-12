import { applyJSONPatch } from "./deps.ts";
import type { JSONPatchOperation } from "./deps.ts";
import type { CodemodClientInterface } from "./client_interface.ts";
import type { Codemod } from "./codemod.ts";
import { CodemodType } from "./codemod.ts";

export class Client implements CodemodClientInterface {
  public async do(data: Codemod): Promise<void> {
    for (const file of data.files) {
      switch (data.type) {
        case CodemodType.TOUCH: {
          await this.touch(file);
          break;
        }
        case CodemodType.SET: {
          await this.set(file, data.content);
          break;
        }
        case CodemodType.APPEND: {
          await this.append(file, data.content);
          break;
        }
        case CodemodType.PREPEND: {
          await this.prepend(file, data.content);
          break;
        }
        case CodemodType.REPLACE: {
          await this.replace(file, data.regex, data.replaceWith);
          break;
        }
        case CodemodType.JSONPATCH: {
          await this.jsonpatch(file, data.patch);
          break;
        }
        case CodemodType.DELETE: {
          await this.delete(file);
          break;
        }
        default: {
          throw new Error(`Invalid codemod: "${JSON.stringify(data)}"`);
        }
      }
    }
  }

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
    patch: readonly JSONPatchOperation[],
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
