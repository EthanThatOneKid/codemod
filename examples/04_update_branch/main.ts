// File:
// Demonstrates how to update a branch using the GitHub API.
//
// Run:
// deno run -A examples/04_update_branch/main.ts
//

import { GITHUB_TOKEN } from "./env.ts";
import { createCodemod } from "../../github/mod.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const codemod = await createCodemod({
    owner: "EthanThatOneKid",
    repo: "acmcsuf.com",
    token: GITHUB_TOKEN,
  }, (builder) =>
    builder
      .createTree((tree) =>
        tree
          .base("new-branch")
          .text("README.md", (content) => content.replace("Hello", "Hi"))
      )
      .createCommit(
        ({ 0: tree }) => ({ message: "Reword README.md", tree: tree.sha }),
        (commit) => commit.parentRef("new-branch"),
      )
      .createTree((tree) =>
        tree
          .base("new-branch")
          .rename("README.md", "README.txt")
      )
      .createCommit(
        ({ 2: tree }) => ({ message: "Rename README.md", tree: tree.sha }),
        (commit) => commit.parentRef("new-branch"),
      )
      .updateBranch(({ 1: commit }) => ({
        ref: "heads/new-branch",
        sha: commit.sha,
      })));
  console.log(JSON.stringify(codemod, null, 2));
}
