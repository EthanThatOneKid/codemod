/**
 * @fileoverview
 *
 * Demonstrates how to update a pull request using the GitHub API.
 *
 * Run:
 *
 * ```
 * deno run -A examples/07_update_pr.ts
 * ```
 */

import { createCodemod } from "../github/mod.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const codemod = await createCodemod((builder) =>
    builder
      .updatePR({
        title: "Updated title",
        number: 27,
      }), {
    owner: "EthanThatOneKid",
    repo: "pomo",
    token: Deno.env.get("GITHUB_TOKEN")!,
  });
  console.log(JSON.stringify(codemod, null, 2));
}
