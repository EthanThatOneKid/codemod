import { FileSystem } from "./file_system.ts";

export class FakeFileSystem extends FileSystem {
  private files: { [file: string]: string };

  constructor(files: { [file: string]: string }) {
    super();
    this.files = files;
  }

  public read(file: string): Promise<string | undefined> {
    const content = this.files[file];
    if (content === undefined) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(content);
  }

  public write(file: string, content: string): Promise<void> {
    this.files[file] = content;
    return Promise.resolve();
  }

  public delete(file: string): Promise<void> {
    delete this.files[file];
    return Promise.resolve();
  }
}
