// File:
// Demonstrates how to create a branch using the GitHub API.
//
// Run:
// deno run -A examples/03_create_branch/main.ts
//

import { GITHUB_TOKEN } from "./env.ts";
import { createCodemod } from "../../github/mod.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const codemod = await createCodemod((builder) =>
    builder
      .createTree((tree) => tree.text("README.md", "Hello, World!"))
      .createCommit(
        ({ 0: tree }) => ({ message: "Create README.md", tree: tree.sha }),
        (commit) => commit.defaultParent(),
      )
      .createBranch(
        ({ 1: commit }) => ({
          ref: "new-branch",
          sha: commit.sha,
        }),
      ), {
    owner: "EthanThatOneKid",
    repo: "acmcsuf.com",
    token: GITHUB_TOKEN,
  });
  console.log(JSON.stringify(codemod, null, 2));
}
