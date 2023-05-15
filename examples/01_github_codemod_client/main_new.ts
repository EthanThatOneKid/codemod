// File:
// Demonstrates how to create a commit to a new branch with the GitHubCodemodeClient.
//
// Run:
// deno run -A examples/01_github_codemod_client/main_new.ts
//

import { GitHubAPIClient } from "../../github/api/mod.ts";
import { GitHubCodemodClient } from "../../github/mod.ts";
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
  const codemodClient = new GitHubCodemodClient(
    apiClient,
  );
  // At this point, what does the commitClient need?
  // - message!
  // - author?
  // - committer?
  // - signature?
  // - parent branch commit SHAs.
  // - parent branch tree SHA.
  // - names of parent branches or parent branch commit SHAs if given. If not given, use default branch.
  const commitClient = await codemodClient.newCodemod({
    message: "Hello Codemod!",
    tree: "",
  });

  //   const treeSHA = tree.sha;
  //   console.log({ branchTreeSHA, branchCommitSHA, treeSHA });
  //   const commit = await client.postReposOwnerRepoGitCommits({
  //     message: "Hello Codemod!",
  //     tree: treeSHA,
  //     parents: [branchCommitSHA],
  //   });

  //   const commitSHA = commit.sha;
  //   console.log({ commitSHA });
  //   const ref = await client.postReposOwnerRepoGitRefs({
  //     ref: "refs/heads/hello-codemod-01",
  //     sha: commitSHA,
  //   });

  //   console.log({ ref });
}
