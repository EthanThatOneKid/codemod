import type {
  CodemodifierInterface,
  CommitCodemodifierInterface,
  InitialCodemodifierInterface,
  ReadCodemodifierInterface,
  WriteCodemodifierInterface,
} from "./codemodifier_interface.ts";
// import { CodemodifierState } from "./codemodifier_interface.ts";
import type { CommitOptions, PROptions } from "./options.ts";

export class Codemodifier implements CodemodifierInterface {
  private state: CodemodifierInterface;

  constructor() {
    this.state = new InitialCodemodifier(this);
  }

  async read(file: string): Promise<ReadCodemodifierInterface> {
    return this.state.read(file);
  }

  async commit(options: CommitOptions): Promise<CommitCodemodifierInterface> {
    return this.state.commit(options);
  }

  async pr(options: PROptions): Promise<InitialCodemodifierInterface> {
    return this.state.pr(options);
  }

  private setState(state: CodemodifierInterface): void {
    this.state = state;
  }
}

export class InitialCodemodifier implements InitialCodemodifierInterface {
  constructor(
    private readonly codemodifier: Codemodifier,
  ) {
  }

  async read(file: string): Promise<ReadCodemodifierInterface> {
    return new ReadCodemodifier(this.codemodifier, file);
  }
}

export class ReadCodemodifier implements ReadCodemodifierInterface {
  public readonly exists: boolean;
  public readonly content: string;

  constructor(
    private readonly codemodifier: Codemodifier,
    readonly file: string,
  ) {
    this.exists = Deno.statSync(this.file).isFile;
    this.content = Deno.readTextFileSync(this.file);
  }

  async touch(): Promise<WriteCodemodifierInterface> {
    this.codemodifier.setState(new WriteCodemodifier(this.codemodifier, this));
    return this.codemodifier.state;
  }

  async set(content: string): Promise<WriteCodemodifierInterface> {
    this.codemodifier.setState(new WriteCodemodifier(this.codemodifier, this));
    return this.codemodifier.state;
  }

  async append(content: string): Promise<WriteCodemodifierInterface> {
    this.codemodifier.setState(new WriteCodemodifier(this.codemodifier, this));
    return this.codemodifier.state;
  }

  async prepend(content: string): Promise<WriteCodemodifierInterface> {
    this.codemodifier.setState(new WriteCodemodifier(this.codemodifier, this));
    return this.codemodifier.state;
  }

  async replace(
    searchValue: string | RegExp,
    replaceValue: string,
  ): Promise<WriteCodemodifierInterface> {
    this.codemodifier.setState(new WriteCodemodifier(this.codemodifier, this));
    return this.codemodifier.state;
  }

  async jsonpatch(
    patch: { op: string; path: string; value: string }[],
  ): Promise<WriteCodemodifierInterface> {
    this.codemodifier.setState(new WriteCodemodifier(this.codemodifier, this));
    return this.codemodifier.state;
  }

  async delete(): Promise<WriteCodemodifierInterface> {
    this.codemodifier.setState(new WriteCodemodifier(this.codemodifier, this));
    return this.codemodifier.state;
  }
}
