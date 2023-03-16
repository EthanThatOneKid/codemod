/**
 * A file system implementation in Deno.
 */
export abstract class FileSystemTransaction {
  /**
   * Read a file.
   */
  public abstract read(file: string): Promise<string | undefined>;

  /**
   * Write a file.
   */
  public abstract write(file: string, content: string): Promise<void>;

  /**
   * Delete a file.
   */
  public abstract delete(file: string): Promise<void>;

  /**
   * Commit the transaction.
   */
  public abstract commit(): Promise<void>;

  /**
   * Make a PR.
   *
   * This commits the transaction and makes a PR.
   */
  public abstract pr(): Promise<void>;
}

export abstract class FileSystem<T> {
  public abstract begin(metadata?: T): Promise<FileSystemTransaction>;
}

class GitHubFS extends FileSystem<{ pr: boolean }> {
  public async begin(
    metadata?: { pr: boolean },
  ): Promise<FileSystemTransaction> {
    throw new Error("Not implemented");
  }
}

const fs = new GitHubFS(token);
const tx = fs.begin({ pr: true });
await tx.delete("file");
await tx.commit();
