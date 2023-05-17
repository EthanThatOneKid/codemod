// File:
// Demonstrates how to create a tree using the GitHub API.
//
// Run:
// deno run -A examples/02_create_commit/main.ts
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
    .setTextFile("hello_world.txt", "Hello, World!")
    .createCommit({
      message: "Add hello world",
    });

  console.log({ result });
}
