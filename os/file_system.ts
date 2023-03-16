import type { FileSystem } from "../file_system.ts";

export class OSFileSystem implements FileSystem {
  public async read(file: string): Promise<string | undefined> {
    try {
      return await Deno.readTextFile(file);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return undefined;
      }

      throw error;
    }
  }

  public async write(file: string, content: string): Promise<void> {
    await Deno.writeTextFile(file, content);
  }

  public async delete(file: string): Promise<void> {
    await Deno.remove(file);
  }
}
