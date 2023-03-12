import type { JSONPatchOperation } from "./deps.ts";

/**
 * The type of codemod to perform.
 */
export enum CodemodType {
  TOUCH = "touch",
  SET = "set",
  APPEND = "append",
  PREPEND = "prepend",
  REPLACE = "replace",
  JSONPATCH = "jsonpatch",
  DELETE = "delete",
}

/**
 * A codemod is a set of instructions to modify a file.
 */
export type Codemod =
  | TouchCodemod
  | SetCodemod
  | AppendCodemod
  | PrependCodemod
  | ReplaceCodemod
  | JSONPatchCodemod
  | DeleteCodemod;

/**
 * A codemod is a set of instructions to modify a file.
 */
export interface BaseCodemod {
  /** The relative paths of the files to modify. */
  files: string[];

  /** The branch to modify. */
  branch?: string;
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

/**
 * A codemod that applies a JSON patch to a file.
 *
 * @see https://github.com/Starcounter-Jack/JSON-Patch#readme
 */
export interface JSONPatchCodemod extends BaseCodemod {
  /** The type of codemod to perform. */
  type: CodemodType.JSONPATCH;

  /** The JSON patch to apply. */
  patch: ReadonlyArray<JSONPatchOperation>;

  /** The replacer to use when stringifying the JSON. */
  replacer?: Parameters<typeof JSON.stringify>[1];

  /** The space to use when stringifying the JSON. */
  space?: Parameters<typeof JSON.stringify>[2];
}

/** A codemod that deletes a file. */
export interface DeleteCodemod extends BaseCodemod {
  /** The type of codemod to perform. */
  type: CodemodType.DELETE;
}
