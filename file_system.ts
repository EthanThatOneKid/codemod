/**
 * A file system implementation in Deno.
 */
export abstract class FileSystem {
  /**
   * Read a file.
   */
  public async read(file: string): Promise<string | undefined> {
    try {
      return await Deno.readTextFile(file);
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
        return undefined;
      }

      throw e;
    }
  }

  /**
   * Write a file.
   */
  public async write(file: string, content: string): Promise<void> {
    await Deno.writeTextFile(file, content);
  }

  /**
   * Delete a file.
   */
  public async delete(file: string): Promise<void> {
    await Deno.remove(file);
  }
}
