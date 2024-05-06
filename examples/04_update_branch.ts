/**
 * @fileoverview
 *
 * Demonstrates how to update a branch using the GitHub API.
 *
 * Run:
 *
 * ```
 * deno run -A examples/04_update_branch.ts
 * ```
 */

import { createCodemod } from "../github/mod.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const codemod = await createCodemod((builder) =>
    builder
      .createTree((tree) =>
        tree
          .baseRef("new-branch")
          .rename("README.md", "README.txt")
      )
      .createCommit(
        ({ 0: tree }) => ({ message: "Rename README.md", tree: tree.sha }),
        (commit) => commit.parentRef("new-branch"),
      )
      .updateBranch(({ 1: commit }) => ({
        ref: "new-branch",
        sha: commit.sha,
      })), {
    owner: "EthanThatOneKid",
    repo: "acmcsuf.com",
    token: Deno.env.get("GITHUB_TOKEN")!,
  });
  console.log(JSON.stringify(codemod, null, 2));
}
