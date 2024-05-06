/**
 * @fileoverview
 *
 * Demonstrates how to create a tree using the GitHub API.
 *
 * Run:
 *
 * ```
 * deno run -A examples/01_create_tree.ts
 * ```
 */

import { createCodemod } from "../github/mod.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const codemod = await createCodemod((builder) =>
    builder
      .createTree((tree) => tree.text("README.md", "Hello, World!")), {
    owner: "EthanThatOneKid",
    repo: "acmcsuf.com",
    token: Deno.env.get("GITHUB_TOKEN")!,
  });
  console.log(JSON.stringify(codemod, null, 2));
}
