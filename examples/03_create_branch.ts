/**
 * @fileoverview
 *
 * Demonstrates how to create a branch using the GitHub API.
 *
 * Run:
 *
 * ```
 * deno run -A examples/03_create_branch.ts
 * ```
 */

import { createCodemod } from "../github/mod.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const codemod = await createCodemod((builder) =>
    builder
      .createTree((tree) => tree.text("README.md", "Hello, World!"))
      .createCommit(
        ({ 0: tree }) => ({ message: "Create README.md", tree: tree.sha }),
      )
      .createBranch(
        ({ 1: commit }) => ({
          ref: "new-branch",
          sha: commit.sha,
        }),
      ), {
    owner: "EthanThatOneKid",
    repo: "acmcsuf.com",
    token: Deno.env.get("GITHUB_TOKEN")!,
  });
  console.log(JSON.stringify(codemod, null, 2));
}
