import type { Codemod, CodemodClient } from "./types.ts";
import { CodemodType } from "./types.ts";

export async function codemod(
  client: CodemodClient,
  data: Codemod,
): Promise<void> {
  for (const file of data.files) {
    switch (data.type) {
      case CodemodType.TOUCH: {
        await client.touch(file);
        break;
      }
      case CodemodType.SET: {
        await client.set(file, data.content);
        break;
      }
      case CodemodType.APPEND: {
        await client.append(file, data.content);
        break;
      }
      case CodemodType.PREPEND: {
        await client.prepend(file, data.content);
        break;
      }
      case CodemodType.REPLACE: {
        await client.replace(file, data.regex, data.replaceWith);
        break;
      }
      case CodemodType.DELETE: {
        await client.delete(file);
        break;
      }
      default: {
        throw new Error(`Invalid codemod: "${JSON.stringify(data)}"`);
      }
    }
  }
}
