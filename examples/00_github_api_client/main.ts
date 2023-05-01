// Run:
// deno run -A examples/00_github_api_client/main.ts
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
  // const repository = await client.getReposOwnerRepo();
  // const repositoryDefaultBranch = repository.default_branch;
  const branch = await client.getReposOwnerRepoBranchesBranch({
    branch: "refs/heads/hello-codemod",
  });
  // const branchCommitSHA = branch.commit.sha;
  const branchTreeSHA = branch.commit.commit.tree.sha;
  const tree = await client.postReposOwnerRepoGitTrees({
    base_tree: branchTreeSHA,
    tree: [
      {
        path: "hello_codemod.txt",
        mode: "100644",
        type: "blob",
        content: "Hello Codemod!!\n",
      },
    ],
  });
  const treeSHA = tree.sha;
  const branchCommitSHA = branch.commit.sha;
  console.log({ branchTreeSHA, branchCommitSHA, treeSHA });
  const commit = await client.postReposOwnerRepoGitCommits({
    message: "Hello Codemod!!",
    tree: treeSHA,
    parents: [branchCommitSHA],
  });
  const commitSHA = commit.sha;
  console.log({ commitSHA });
  const ref = await client.patchReposOwnerRepoGitRefsRef({
    ref: `refs/heads/hello-codemod`,
    sha: commitSHA,
  });
  console.log({ ref });
}
