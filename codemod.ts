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
 * An input codemod.
 */
export type CodemodInput =
  & CodemodInputBase
  & Codemod;

/**
 * A codemod output.
 */
export type CodemodOutput =
  & CodemodOutputBase
  & Codemod;

/**
 * A codemod input.
 */
export interface CodemodInputBase {
  /** The relative paths of the files to modify. */
  files: string[];
}

/**
 * A codemod output.
 */
export interface CodemodOutputBase {
  /** The relative path of the file that were modified. */
  file: string;

  /** The diff of the file before and after the codemod. */
  diff: DiffCharacter[];
}

/**
 * A diff character.
 */
export interface DiffCharacter {
  /** The character. */
  character: string;

  /** The type of diff. */
  type: DiffType;
}

/** The type of diff. */
export enum DiffType {
  UNCHANGED,
  ADDED,
  REMOVED,
}

/**
 * A codemod that creates a blank file.
 */
export interface TouchCodemod {
  /** The type of codemod to perform. */
  type: CodemodType.TOUCH;
}

/**
 * A codemod that deterministically sets the content of a file.
 *
 * It creates the file if it doesn't exist, and overwrites it if it does.
 */
export interface SetCodemod {
  /** The type of codemod to perform. */
  type: CodemodType.SET;

  /** The content to set. */
  content: string;
}

/** A codemod that appends content to a file. */
export interface AppendCodemod {
  /** The type of codemod to perform. */
  type: CodemodType.APPEND;

  /** The content to append. */
  content: string;
}

/** A codemod that prepends content to a file. */
export interface PrependCodemod {
  /** The type of codemod to perform. */
  type: CodemodType.PREPEND;

  /** The content to prepend. */
  content: string;
}

/** A codemod that replaces content in a file. */
export interface ReplaceCodemod {
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
export interface JSONPatchCodemod {
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
export interface DeleteCodemod {
  /** The type of codemod to perform. */
  type: CodemodType.DELETE;
}
