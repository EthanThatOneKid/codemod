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

// TODO: Reference
// https://github.com/acmcsufoss/codemod/blob/e4b64c0cd1b50f4181efa8b0d923931a50aece91/github/commit/create.ts

async function main() {
  const codemod = await createCodemod({
    owner: "EthanThatOneKid",
    repo: "acmcsuf.com",
    token: GITHUB_TOKEN,
  }, (builder) =>
    builder
      .createTree((tree) => tree.text("README.md", "Hello, World!"))
      .createCommit(({ 0: tree }) => ({
        message: "Create README.md",
        tree: tree.sha,
      })));
  console.log(JSON.stringify(codemod, null, 2));
}
