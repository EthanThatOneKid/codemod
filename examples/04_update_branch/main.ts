// File:
// Demonstrates how to update a branch using the GitHub API.
//
// Run:
// deno run -A examples/04_update_branch/main.ts
//

import { GitHubCodemodBuilder } from "../../github/mod.ts";
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
    .setTextFile("hello_world.txt", "Hello, World!!!")
    .updateBranch({
      message: "Add hello world",
      baseBranchName: "new-branch",
      headBranchName: "new-branch",
    });

  console.log({ result });
}
