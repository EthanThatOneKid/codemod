import type { JSONPatchOperation } from "./deps.ts";
import type { CommitOptions, PROptions } from "./options.ts";

enum BuilderState {
  NONE,
  READ,
  WRITE,
  COMMIT,
  PR,
}

export type BuilderInterface<T extends BuilderState = BuilderState.NONE> =
  T extends BuilderState.NONE ? NoneBuilderInterface
    : T extends BuilderState.READ ? ReadBuilderInterface
    : T extends BuilderState.WRITE ? WriteBuilderInterface
    : T extends BuilderState.COMMIT ? CommitBuilderInterface
    : never;

export interface NoneBuilderInterface {
  read: BuilderRead;
}

export interface ReadBuilderInterface {
  touch: BuilderTouch;
  set: BuilderSet;
  append: BuilderAppend;
  prepend: BuilderPrepend;
  replace: BuilderReplace;
  jsonpatch: BuilderJSONPatch;
  delete: BuilderDelete;
}

export interface WriteBuilderInterface {
  commit: BuilderCommit;
  read: BuilderRead;
}

export interface CommitBuilderInterface {
  pr: BuilderPR;
}

export type BuilderRead = (file: string) => ReadBuilderInterface;

export type BuilderTouch = (
  file: string,
) => BuilderInterface<BuilderState.WRITE>;

export type BuilderSet = (
  file: string,
  content: string,
) => BuilderInterface<BuilderState.WRITE>;

export type BuilderAppend = (
  file: string,
  content: string,
) => BuilderInterface<BuilderState.WRITE>;

export type BuilderPrepend = (
  file: string,
  content: string,
) => BuilderInterface<BuilderState.WRITE>;

export type BuilderReplace = (
  file: string,
  regex: RegExp,
  replaceWith: string,
) => BuilderInterface<BuilderState.WRITE>;

export type BuilderJSONPatch = (
  file: string,
  patch: ReadonlyArray<JSONPatchOperation>,
  // deno-lint-ignore no-explicit-any
  replacer?: ((this: any, key: string, value: any) => any) | undefined,
  space?: string | number | undefined,
) => BuilderInterface<BuilderState.WRITE>;

export type BuilderDelete = (
  file: string,
) => BuilderInterface<BuilderState.WRITE>;

export type BuilderCommit = (
  options: CommitOptions,
) => BuilderInterface<BuilderState.COMMIT>;

export type BuilderPR = (
  options: PROptions,
) => BuilderInterface<BuilderState.PR>;
