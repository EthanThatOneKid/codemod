import { NoneBuilderInterface } from "../builder_interface.ts";
import type { JSONPatchOperation } from "../deps.ts";
import type { CommitOptions, PROptions } from "../options.ts";

enum FileSystemClientState {
  INITIAL,
  READ,
  WRITE,
  COMMIT,
  PR,
}

export type FileSystemClientInterface<
  T extends FileSystemClientState = FileSystemClientState.INITIAL,
  S extends string = string,
> = T extends FileSystemClientState.INITIAL ? InitialFileSystemClientInterface
  : T extends FileSystemClientState.READ ? ReadFileSystemClientInterface<S>
  : T extends FileSystemClientState.WRITE ? WriteFileSystemClientInterface
  : T extends FileSystemClientState.COMMIT ? CommitFileSystemClientInterface
  : never;

export interface InitialFileSystemClientInterface {
  read<S extends string>(file: S): ReadFileSystemClientInterface<S>;
}

export interface ReadFileSystemClientInterface<S extends string> {
  readonly file: S;

  touch(): WriteFileSystemClientInterface;
  set(): WriteFileSystemClientInterface;
  append(): WriteFileSystemClientInterface;
  prepend(): WriteFileSystemClientInterface;
  replace(): WriteFileSystemClientInterface;
  jsonpatch(): WriteFileSystemClientInterface;
  delete(): WriteFileSystemClientInterface;

  // readonly append: FileSystemAppend;
  // readonly prepend: FileSystemPrepend;
  // readonly replace: FileSystemReplace;
  // readonly jsonpatch: FileSystemJSONPatch;
  // readonly delete: FileSystemDelete;
}

export interface WriteFileSystemClientInterface {
  commit(options: CommitOptions): CommitFileSystemClientInterface;
  read<S extends string>(file: S): ReadFileSystemClientInterface<S>;
}

export interface CommitFileSystemClientInterface {
  pr(options: PROptions): InitialFileSystemClientInterface;
}

/*
export interface WriteFileSystemInterface {
  commit: FileSystemCommit;
  read: FileSystemRead;
}

export interface CommitFileSystemInterface {
  pr: FileSystemPR;
}

export type FileSystemRead = (file: string) => ReadFileSystemInterface;

export type FileSystemTouch = (
  file: string,
) => FileSystemInterface<FileSystemState.WRITE>;

export type FileSystemSet = (
  file: string,
  content: string,
) => FileSystemInterface<FileSystemState.WRITE>;

export type FileSystemAppend = (
  file: string,
  content: string,
) => FileSystemInterface<FileSystemState.WRITE>;

export type FileSystemPrepend = (
  file: string,
  content: string,
) => FileSystemInterface<FileSystemState.WRITE>;

export type FileSystemReplace = (
  file: string,
  regex: RegExp,
  replaceWith: string,
) => FileSystemInterface<FileSystemState.WRITE>;

export type FileSystemJSONPatch = (
  file: string,
  patch: ReadonlyArray<JSONPatchOperation>,
  // deno-lint-ignore no-explicit-any
  replacer?: ((this: any, key: string, value: any) => any) | undefined,
  space?: string | number | undefined,
) => FileSystemInterface<FileSystemState.WRITE>;

export type FileSystemDelete = (
  file: string,
) => FileSystemInterface<FileSystemState.WRITE>;

export type FileSystemCommit = (
  options: CommitOptions,
) => FileSystemInterface<FileSystemState.COMMIT>;

export type FileSystemPR = (
  options: PROptions,
) => FileSystemInterface<FileSystemState.PR>;
*/
