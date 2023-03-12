import type { JSONPatchOperation } from "./deps.ts";
import type { CommitOptions, PROptions } from "./options.ts";

enum CodemodifierState {
  INITIAL = "initial",
  READ = "read",
  WRITE = "write",
  COMMIT = "commit",
  PR = "pr",
}

export type CodemodifierInterface<
  T extends CodemodifierState = CodemodifierState.INITIAL,
> = T extends CodemodifierState.INITIAL ? InitialCodemodifierInterface
  : T extends CodemodifierState.READ ? ReadCodemodifierInterface
  : T extends CodemodifierState.WRITE ? WriteCodemodifierInterface
  : T extends CodemodifierState.COMMIT ? CommitCodemodifierInterface
  : T extends CodemodifierState.PR ? InitialCodemodifierInterface
  : never;

export interface InitialCodemodifierInterface {
  readonly read: ReadFn;
}

export interface ReadCodemodifierInterface {
  readonly file: string;
  readonly exists: boolean;
  readonly content: string;

  readonly touch: TouchFn;
  readonly set: SetFn;
  readonly append: AppendFn;
  readonly prepend: PrependFn;
  readonly replace: ReplaceFn;
  readonly jsonpatch: JSONPatchFn;
  readonly delete: DeleteFn;
}

export interface WriteCodemodifierInterface {
  readonly commit: CommitFn;
  readonly read: ReadFn;
}

export interface CommitCodemodifierInterface {
  readonly pr: PRFn;
}

export type ReadFn = (
  file: string,
) => Promise<CodemodifierInterface<CodemodifierState.READ>>;

export type TouchFn = () => Promise<
  CodemodifierInterface<CodemodifierState.WRITE>
>;

export type SetFn = (
  content: string,
) => Promise<CodemodifierInterface<CodemodifierState.WRITE>>;

export type AppendFn = (
  content: string,
) => Promise<CodemodifierInterface<CodemodifierState.WRITE>>;

export type PrependFn = (
  content: string,
) => Promise<CodemodifierInterface<CodemodifierState.WRITE>>;

export type ReplaceFn = (
  regex: RegExp,
  replaceWith: string,
) => Promise<CodemodifierInterface<CodemodifierState.WRITE>>;

export type JSONPatchFn = (
  patch: ReadonlyArray<JSONPatchOperation>,
  replacer?: Parameters<typeof JSON.stringify>[1],
  space?: Parameters<typeof JSON.stringify>[2],
) => Promise<CodemodifierInterface<CodemodifierState.WRITE>>;

export type DeleteFn = () => Promise<
  CodemodifierInterface<CodemodifierState.WRITE>
>;

export type CommitFn = (
  options: CommitOptions,
) => Promise<CodemodifierInterface<CodemodifierState.COMMIT>>;

export type PRFn = (
  options: PROptions,
) => Promise<CodemodifierInterface<CodemodifierState.PR>>;
