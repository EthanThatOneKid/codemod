/**
 * @fileoverview
 *
 * Demonstrates how to maybe create a PR using the GitHub API.
 *
 * Run:
 *
 * ```
 * deno run -A examples/08_maybe_create_pr.ts
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
        tree.text(
          "main.ts",
          `console.log('Hello, world! ${
            Math.random().toString(32).slice(2)
          }');\n`,
        )
      )
      .createCommit(({ 0: tree }) => ({
        message: "Add main.ts",
        tree: tree.sha,
      }), (commit) =>
        commit
          .parentRef("new-branch"))
      .createOrUpdateBranch(({ 1: commit }) => ({
        ref: "new-branch",
        sha: commit.sha,
      }))
      .maybeCreatePR({
        title: "Add main.ts",
        body: "This PR adds main.ts.",
        head: "new-branch",
        base: "",
      }), {
    owner: "EthanThatOneKid",
    repo: "pomo",
    token: Deno.env.get("GITHUB_TOKEN")!,
  });

  console.log(JSON.stringify(codemod, null, 2));
}
