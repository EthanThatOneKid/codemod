// File:
// Demonstrates how to create or update a branch using the GitHub API.
//
// Run:
// deno run -A examples/06_create_pr/main.ts
//

import { GitHubCodemodBuilder } from "../../github/mod.ts";
import { GitHubBranchAction } from "../../github/pr/types.ts";
import { GITHUB_TOKEN } from "./env.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const result = await new GitHubCodemodBuilder({
    owner: "EthanThatOneKid",
    repo: "acmcsuf.com",
    token: GITHUB_TOKEN,
  })
    .setTextFile("hello_world.txt", "Hello, World! 💖")
    .createPR({
      title: "[TEST] Codemod hello world",
      message:
        "Add hello world. Please ignore me! Context: <https://oss.acmcsuf.com/codemod/pull/3>.",
      headBranchName: "new-branch",
    });

  console.log({ result });
}
