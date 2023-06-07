// File:
// Demonstrates how to create or update a branch using the GitHub API.
//
// Run:
// deno run -A examples/05_create_or_update_branch/main.ts
//

import { GITHUB_TOKEN } from "./env.ts";
import { createCodemod } from "../../github/mod.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const codemod = await createCodemod((builder) =>
    builder
      .createTree((tree) =>
        tree
          .baseRef("new-branch")
          .text("main.ts", "console.log('Hello, world!!!');\n")
      )
      .createCommit(
        ({ 0: tree }) => ({ message: "Add main.ts", tree: tree.sha }),
        (commit) => commit.parentRef("new-branch"),
      )
      .createOrUpdateBranch(({ 1: commit }) => ({
        ref: "new-branch",
        sha: commit.sha,
      })), {
    owner: "EthanThatOneKid",
    repo: "acmcsuf.com",
    token: GITHUB_TOKEN,
  });
  console.log(JSON.stringify(codemod, null, 2));
}
