import type { Codemod } from "./codemod.ts";

/**
 * The options for a client.
 *
 * @todo Add more options.
 */
export interface Options {
  codemods: Codemod[];
  token?: string;
  repo?: string;
  commit?: CommitOptions;
  pr?: PROptions;
}

/**
 * The options for a commit.
 *
 * @see https://docs.github.com/en/rest/reference/git#create-a-commit
 * @todo Add more options.
 */
export interface CommitOptions {
  message: string;
  committer: {
    name: string;
    email: string;
  };
  head: string;
}

/**
 * The options for a PR.
 *
 * @see https://docs.github.com/en/rest/reference/pulls#create-a-pull-request
 * @todo Add more options.
 */
export interface PROptions {
  title: string;
  body: string;
  base: string;
}
