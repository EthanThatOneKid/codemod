// File:
// Demonstrates how to create a tree using the GitHub API.
//
// Run:
// deno run -A examples/01_create_tree/main.ts
//

import { GitHubAPIClient } from "../../github/api/mod.ts";
import { GitHubCodemodBuilder } from "../../github/mod.ts";
import { GITHUB_TOKEN } from "./env.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const apiClient = new GitHubAPIClient({
    owner: "EthanThatOneKid",
    repo: "acmcsuf.com",
    token: GITHUB_TOKEN,
  });

  const result = await new GitHubCodemodBuilder(apiClient)
    .addTextFile("hello_world.txt", "Hello, World!")
    .createTree();

  console.log({ result });
}
