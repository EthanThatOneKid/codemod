// File:
// Demonstrates how to maybe create a PR using the GitHub API.
//
// Run:
// deno run -A examples/08_maybe_create_pr/main.ts
//

import { GITHUB_TOKEN } from "./env.ts";
import { createCodemod } from "../../github/mod.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const codemod = await createCodemod((builder) =>
    builder
      .createTree((tree) =>
        tree.text("main.ts", "console.log('Hello, world!');")
      )
      .createCommit(
        ({ 0: tree }) => ({ message: "Add main.ts", tree: tree.sha }),
      )
      .maybeCreatePR({
        title: "Add main.ts",
        body: "This PR adds main.ts.",
        head: "new-branch",
        base: "",
      }), {
    owner: "EthanThatOneKid",
    repo: "pomo",
    token: GITHUB_TOKEN,
  });

  console.log(JSON.stringify(codemod, null, 2));
}
