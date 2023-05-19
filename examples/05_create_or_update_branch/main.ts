// File:
// Demonstrates how to create or update a branch using the GitHub API.
//
// Run:
// deno run -A examples/05_create_or_update_branch/main.ts
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
    .setText("hello_world.txt", "Hello, World! 💖")
    .createOrUpdateBranch({
      message: "Add hello world",
      newBranchName: "new-branch",
    });

  console.log({ result });
}
