import { applyJSONPatch } from "./deps.ts";
import type { JSONPatchOperation } from "./deps.ts";
import type { CodemodClientInterface } from "./client_interface.ts";
import type { Codemod } from "./codemod.ts";
// import { CodemodType } from "./codemod.ts";

export abstract class Client implements CodemodClientInterface {
  async do(codemods: Codemod[]): Promise<Response[]> {
    const responses: Response[] = [];
    for (const codemod of codemods) {
      for (const file of codemod.files) {
        let r: Response;
        // Note: Update this switch statement when new codemod types are added.
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
            r = await this.prepend(file, codemod.content);
            break;
          }
          case "replace": {
            r = await this.replace(
              file,
              codemod.regex,
              codemod.replaceWith,
            );
            break;
          }
          case "jsonpatch": {
            r = await this.jsonpatch(
              file,
              codemod.patch,
              codemod.replacer,
              codemod.space,
            );
            break;
          }
          case "delete": {
            r = await this.delete(file);
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

    return responses;
  }

  public async touch(file: string): Promise<Response> {
    try {
      await Deno.writeTextFile(file, "");
      return Response.json({ message: "File created.", data: { file } });
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  }

  public async set(file: string, content: string): Promise<Response> {
    try {
      await Deno.writeTextFile(file, content);
      return Response.json({
        message: "File updated.",
        data: { file, content },
      });
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  }

  public async append(file: string, content: string): Promise<Response> {
    try {
      await Deno.writeTextFile(file, content, { append: true });
      return Response.json({
        message: "File appended.",
        data: { file, content },
      });
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  }

  public async prepend(file: string, content: string): Promise<Response> {
    try {
      const originalContent = await Deno.readTextFile(file);
      const newContent = content + originalContent;
      await Deno.writeTextFile(file, newContent);
      return Response.json({
        message: "File prepended.",
        data: { file, content },
      });
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  }

  public async replace(
    file: string,
    regex: RegExp,
    replaceWith: string,
  ): Promise<Response> {
    try {
      const originalContent = await Deno.readTextFile(file);
      const newContent = originalContent.replace(regex, replaceWith);
      await Deno.writeTextFile(file, newContent);
      return Response.json({
        message: "File replaced.",
        data: { file, regex, replaceWith },
      });
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  }

  public async jsonpatch(
    file: string,
    patch: readonly JSONPatchOperation[],
    replacer?: Parameters<typeof JSON.stringify>[1],
    space?: Parameters<typeof JSON.stringify>[2],
  ): Promise<Response> {
    try {
      const originalContent = await Deno.readTextFile(file);
      const originalJSON = JSON.parse(originalContent);
      const newJSON = applyJSONPatch(originalJSON, patch);
      const newContent = JSON.stringify(newJSON, replacer, space);
      await Deno.writeTextFile(file, newContent);
      return Response.json({
        message: "File patched.",
        data: { file, patch },
      });
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  }

  public async delete(file: string): Promise<Response> {
    try {
      await Deno.remove(file);
      return Response.json({ message: "File deleted.", data: { file } });
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  }
}
