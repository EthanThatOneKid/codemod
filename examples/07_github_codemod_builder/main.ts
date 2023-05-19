// File:
// Demonstrates how to create or update a branch using the GitHub API.
//
// Run:
// deno run -A examples/07_github_codemod_builder/main.ts
//

import type { GitHubCodemodBuilderInterface } from "../../github/github_codemod_builder_interface.ts";
import { GitHubCodemodBuilder } from "../../github/mod.ts";
import { GITHUB_TOKEN } from "./env.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const builder = new GitHubCodemodBuilder({
    owner: "EthanThatOneKid",
    repo: "acmcsuf.com",
    token: GITHUB_TOKEN,
  });
  await part1(builder.clone());
  await part2(builder.clone());
  await part3(builder.clone());
}

async function part1(builder: GitHubCodemodBuilderInterface) {
  const result = await builder
    .setText("hello_world.txt", "Hello, World!")
    .createBranch({
      message: "Add hello world",
      newBranchName: "new-branch",
    });
  console.log("Part 1", { result });
}

async function part2(builder: GitHubCodemodBuilderInterface) {
  const result = await builder
    .editText(
      "hello_world.txt",
      (content) => [content, content, content].join("\n"),
    )
    .setText("temp.txt", "TODO: Delete me!")
    .updateBranch({
      message: "Triple hello world",
      baseBranchName: "new-branch",
    });
  console.log("Part 2", { result });
}

async function part3(builder: GitHubCodemodBuilderInterface) {
  const result = await builder
    .editText(
      "hello_world.txt",
      (content) => content.replace("Hello, World!", "Hello, World! 💖"),
    )
    .delete("temp.txt")
    .createPR({
      title: "[TEST] Add hello world",
      body: "This is a test PR. Please ignore.",
      message: "Add hello world 💖",
      newBranchName: "new-branch",
    });
  console.log("Part 3", { result });
}
