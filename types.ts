/**
 * The type of codemod to perform.
 */
export enum CodemodType {
  TOUCH = "touch",
  SET = "set",
  APPEND = "append",
  PREPEND = "prepend",
  REPLACE = "replace",
  DELETE = "delete",
}

/**
 * A codemod is a set of instructions to modify a file.
 */
export interface BaseCodemod {
  /** The relative paths of the files to modify. */
  files: string[];
}

/**
 * A codemod that creates a blank file.
 */
export interface TouchCodemod extends BaseCodemod {
  /** The type of codemod to perform. */
  type: CodemodType.TOUCH;
}

/**
 * A codemod that deterministically sets the content of a file.
 *
 * It creates the file if it doesn't exist, and overwrites it if it does.
 */
export interface SetCodemod extends BaseCodemod {
  /** The type of codemod to perform. */
  type: CodemodType.SET;

  /** The content to set. */
  content: string;
}

/** A codemod that appends content to a file. */
export interface AppendCodemod extends BaseCodemod {
  /** The type of codemod to perform. */
  type: CodemodType.APPEND;

  /** The content to append. */
  content: string;
}

/** A codemod that prepends content to a file. */
export interface PrependCodemod extends BaseCodemod {
  /** The type of codemod to perform. */
  type: CodemodType.PREPEND;

  /** The content to prepend. */
  content: string;
}

/** A codemod that replaces content in a file. */
export interface ReplaceCodemod extends BaseCodemod {
  /** The type of codemod to perform. */
  type: CodemodType.REPLACE;

  /** The regex to match. */
  regex: RegExp;

  /** The content to replace with. */
  replaceWith: string;
}

/** A codemod that deletes a file. */
export interface DeleteCodemod extends BaseCodemod {
  /** The type of codemod to perform. */
  type: CodemodType.DELETE;
}

export type Codemod =
  | TouchCodemod
  | SetCodemod
  | AppendCodemod
  | PrependCodemod
  | ReplaceCodemod
  | DeleteCodemod;

export interface CodemodClient {
  touch(file: string): Promise<void>;
  set(file: string, content: string): Promise<void>;
  append(file: string, content: string): Promise<void>;
  prepend(file: string, content: string): Promise<void>;
  replace(file: string, regex: RegExp, replaceWith: string): Promise<void>;
  delete(file: string): Promise<void>;
}
