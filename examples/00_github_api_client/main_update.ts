// File:
// Demonstrates how to update a branch to reference a new commit
// (i.e. create a commit on an existing branch).
//
// Run:
// deno run -A examples/00_github_api_client/main_update.ts
//

import { GitHubAPIClient } from "../../github/api/mod.ts";
import { GITHUB_TOKEN } from "./env.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  const client = new GitHubAPIClient({
    owner: "EthanThatOneKid",
    repo: "acmcsuf.com",
    token: GITHUB_TOKEN,
  });
  const branch = await client.getReposOwnerRepoBranchesBranch({
    branch: "refs/heads/hello-codemod-00",
  });

  const branchCommitSHA = branch.commit.sha;
  const branchTreeSHA = branch.commit.commit.tree.sha;
  const randomData = crypto.randomUUID();
  const tree = await client.postReposOwnerRepoGitTrees({
    base_tree: branchTreeSHA,
    tree: [
      {
        path: "hello_codemod.txt",
        mode: "100644",
        type: "blob",
        content: "Hello Codemod!\n" + randomData + "\n",
      },
    ],
  });

  const treeSHA = tree.sha;
  console.log({ branchTreeSHA, branchCommitSHA, treeSHA });
  const commit = await client.postReposOwnerRepoGitCommits({
    message: "Hello Codemod!!",
    tree: treeSHA,
    parents: [branchCommitSHA],
  });

  const commitSHA = commit.sha;
  console.log({ commitSHA });
  const ref = await client.patchReposOwnerRepoGitRefsRef({
    ref: "heads/hello-codemod-01",
    sha: commitSHA,
  });

  console.log({ ref });
}
