import { parse } from "./deps.ts";
import type { Options } from "./github/mod.ts";
import type { Codemod } from "./codemod.ts";

export type Flags = Options;

export function parseFlags(args: string[]): Flags {
  const flags = parse(args, {
    boolean: ["help"],
    string: [
      "token",
      "repo",
      "codemod",
      "commit.message",
      "commit.committer.name",
      "commit.committer.email",
      "commit.head",
      "pr.title",
      "pr.body",
      "pr.base",
    ],
    alias: {
      help: "h",
      token: "t",
      repo: "r",
      codemod: "c",
    },
  });

  if (flags.help) {
    console.log(`Usage: codemod [options]

Options:
  --help, -h
    Show this help message.
  --token, -t
    The GitHub token to use.
  --repo, -r
    The "owner/name" string of the repository.
  --codemod, -c
    The codemod to use.
  --commit.message, -cm
    The commit message to use.
  --commit.committer.name, -ccn
    The commit author to use.
  --commit.committer.email, -cce
    The commit author to use.
  --commit.head, -ch
    The current branch to use.
  --pr.title, -pt
    The PR title to use.
  --pr.body, -pb
    The PR body to use.
  --pr.base, -pb
    The target branch to use.
`);
    Deno.exit(0);
  }

  const token = flags.token;
  if (!token) {
    throw new Error("Missing token");
  }

  const repo = flags.repo ?? flags.r;
  if (!repo) {
    throw new Error("Missing repo");
  }

  const codemod = flags.codemod ?? flags.c;
  if (!codemod) {
    throw new Error("Missing codemod");
  }

  if (!flags?.commit?.message) {
    throw new Error("Missing commit message");
  }

  if (!flags?.commit?.committer?.name) {
    throw new Error("Missing commit author name");
  }
  if (!flags?.commit?.committer?.email) {
    throw new Error("Missing commit author email");
  }

  if (!flags?.commit?.head) {
    throw new Error("Missing commit head");
  }

  if (!flags?.pr?.title) {
    throw new Error("Missing PR title");
  }

  if (!flags?.pr?.body) {
    throw new Error("Missing PR body");
  }

  if (!flags?.pr?.base) {
    throw new Error("Missing PR base");
  }

  return {
    token,
    repo,
    codemod: JSON.parse(codemod) as Codemod,
    commit: {
      message: flags.commit.message,
      committer: {
        name: flags.commit.committer.name,
        email: flags.commit.committer.email,
      },
      head: flags.commit.head,
    },
    pr: {
      title: flags.pr.title,
      body: flags.pr.body,
      base: flags.pr.base,
    },
  };
}
