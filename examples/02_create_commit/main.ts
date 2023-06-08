// File:
// Demonstrates how to create a commit using the GitHub API.
//
// Run:
// deno run -A examples/02_create_commit/main.ts
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
      .createCommit(({ 0: tree }) => ({
        message: "Create README.md",
        tree: tree.sha,
      })), {
    owner: "EthanThatOneKid",
    repo: "acmcsuf.com",
    token: GITHUB_TOKEN,
  });
  console.log(JSON.stringify(codemod, null, 2));
}
