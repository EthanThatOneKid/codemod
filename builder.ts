import type { JSONPatchOperation } from "./deps.ts";
import type {
  BuilderAppend,
  BuilderDelete,
  BuilderInterface,
  BuilderJSONPatch,
  BuilderPrepend,
  BuilderReplace,
  BuilderSet,
  BuilderTouch,
  ReadBuilderInterface,
  WriteBuilderInterface,
} from "./builder_interface.ts";
import { CommitOptions, Options, PROptions } from "./options.ts";

export type Op<T = void> = () => Promise<OpResult<T>>;

export type OpResult<T = void> = T extends void ? {
    response: Response;
  }
  : {
    response: Response;
    data: T;
  };

export class ReadBuilder implements ReadBuilderInterface {
  constructor(
    private readonly content: string,
  ) {}

  public touch(file: string): WriteBuilderInterface {
  }
  set: BuilderSet;
  append: BuilderAppend;
  prepend: BuilderPrepend;
  replace: BuilderReplace;
  jsonpatch: BuilderJSONPatch;
  delete: BuilderDelete;
}

export class Builder implements BuilderInterface {
  touch(file: string): this {
    throw new Error("Method not implemented.");
  }
  set(file: string, content: string): this {
    throw new Error("Method not implemented.");
  }
  append(file: string, content: string): this {
    throw new Error("Method not implemented.");
  }
  prepend(file: string, content: string): this {
    throw new Error("Method not implemented.");
  }
  replace(file: string, regex: RegExp, replaceWith: string): this {
    throw new Error("Method not implemented.");
  }
  jsonpatch(
    file: string,
    patch: readonly Operation[],
    replacer?: ((this: any, key: string, value: any) => any) | undefined,
    space?: string | number | undefined,
  ): this {
    throw new Error("Method not implemented.");
  }
  delete(file: string): this {
    throw new Error("Method not implemented.");
  }
  codemod(options: Options): this {
    throw new Error("Method not implemented.");
  }
  commit(options: CommitOptions): this {
    throw new Error("Method not implemented.");
  }
  pr(options: PROptions): this {
    throw new Error("Method not implemented.");
  }
  get op(): Op<void> {
    throw new Error("Method not implemented.");
  }
}
