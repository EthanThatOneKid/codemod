// File:
// Demonstrates how to create a commit to a new branch.
//
// Run:
// deno run -A examples/00_github_api_client/main_new.ts
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
  }, fetch.bind(globalThis));
  const repository = await client.getRepository();
  const repositoryDefaultBranch = repository.default_branch;
  const branch = await client.getBranch({
    branch: repositoryDefaultBranch,
  });

  const branchCommitSHA = branch.commit.sha;
  const branchTreeSHA = branch.commit.commit.tree.sha;
  const tree = await client.postTrees({
    base_tree: branchTreeSHA,
    tree: [
      {
        path: "hello_codemod.txt",
        mode: "100644",
        type: "blob",
        content: "Hello Codemod!\n",
      },
    ],
  });

  const treeSHA = tree.sha;
  console.log({ branchTreeSHA, branchCommitSHA, treeSHA });
  const commit = await client.postCommits({
    message: "Hello Codemod!",
    tree: treeSHA,
    parents: [branchCommitSHA],
  });

  const commitSHA = commit.sha;
  console.log({ commitSHA });
  const ref = await client.postRefs({
    ref: "refs/heads/hello-codemod-01",
    sha: commitSHA,
  });

  console.log({ ref });
}
