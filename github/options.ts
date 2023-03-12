import type { Codemod } from "../codemod.ts";

/**
 * The options for a codemod.
 *
 * @todo Add more options.
 */
export interface Options {
  token: string;
  repo: string;
  codemod: Codemod;
  commit: CommitOptions;
  pr: PROptions;
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
