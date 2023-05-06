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
    branch: "refs/heads/hello-codemod-01",
  });

  const blob = await client.postReposOwnerRepoGitBlobs({
    content: await generatePictureData(),
    encoding: "base64",
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
      {
        path: "picture.jpg",
        mode: "100644",
        type: "blob",
        sha: blob.sha,
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

async function generatePictureData(): Promise<string> {
  const response = await fetch("http://placekitten.com/200/300");
  const blob = await response.blob();
  return await blobToBase64(blob);
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Expected reader.result to be a string."));
        return;
      }

      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
