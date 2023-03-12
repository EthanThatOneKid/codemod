import { CommitOptions } from "../options.ts";

import type {
  FileSystemAppend,
  FileSystemDelete,
  FileSystemJSONPatch,
  FileSystemPrepend,
  FileSystemReplace,
  FileSystemSet,
  FileSystemTouch,
  ReadFileSystemInterface,
  WriteFileSystemInterface,
} from "./fs_interface.ts";

export class ReadClient<S extends string> implements ReadFileSystemInterface {
  constructor(
    public file: S,
    public content: string,
  ) {}

  public touch(): FileSystemTouch {
    return (): WriteFileSystemInterface => {
      return new WriteClient();
    };
  }

  set: FileSystemSet;
  append: FileSystemAppend;
  prepend: FileSystemPrepend;
  replace: FileSystemReplace;
  jsonpatch: FileSystemJSONPatch;
  delete: FileSystemDelete;
}

export class WriteClient implements WriteFileSystemInterface {
  public commit(options: CommitOptions): CommitFileSystemInterface {
    return;
  }

  public read(file: string): ReadFileSystemInterface {
    return new ReadClient();
  }
}
