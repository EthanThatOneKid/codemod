/**
 * @fileoverview
 *
 * Demonstrates how to create or update a branch using the GitHub API.
 *
 * Run:
 *
 * ```
 * deno run -A examples/06_create_pr.ts
 * ```
 */

import { createCodemod } from "../github/mod.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const codemod = await createCodemod((builder) =>
    builder
      .createTree((tree) => tree.text("docs/README.md", "Hello, World!"))
      .createCommit(
        ({ 0: tree }) => ({ message: "Create README.md", tree: tree.sha }),
      )
      .createBranch(({ 1: commit }) => ({
        ref: "new-branch-" + Math.random().toString(36).slice(2),
        sha: commit.sha,
      }))
      .createPR(({ 2: branch }) => ({
        title: "Create README.md",
        head: branch.ref,
        base: "",
      })), {
    owner: "EthanThatOneKid",
    repo: "pomo",
    token: Deno.env.get("GITHUB_TOKEN")!,
  });
  console.log(JSON.stringify(codemod, null, 2));
}
