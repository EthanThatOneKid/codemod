# Codemod

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https://oss.acmcsuf.com/codemod/raw/main/github/mod.ts)

Codemod module for making deterministic code modifications on GitHub.

## Usage

```ts
import { createCodemod } from "https://deno.land/x/codemod/github/mod.ts";

const results = await createCodemod((builder) =>
  builder
    .createTree(
      (tree) =>
        tree
          .text("hello_world.txt", "Hello, Ethan!\n")
          .jsonPatch<string[]>(
            "friends.json",
            [{ op: "add", path: "/-", value: "EthanThatOneKid" }],
          ),
    )
    .createCommit(({ 0: tree }) => ({
      message: "Add Ethan as a new friend",
      tree: tree.sha,
    }), (commit) =>
      commit
        .parentRef("new-branch")
        .defaultParent())
    .createOrUpdateBranch(({ 1: commit }) => ({
      ref: "new-branch",
      sha: commit.sha,
    }))
    .maybeCreatePR({
      title: "Add Ethan as a new friend",
      body: "This is a test PR.",
      head: "new-branch",
      base: "", // Defaults to repository's default branch.
    }), {
  owner: "EthanThatOneKid",
  repo: "pomo",
  token: GITHUB_TOKEN,
});

console.log(results);
```

Get a GitHub personal access token
[here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

Fine-tune your personal access token by granting `Read and write` access to only
`Contents` and `Pull requests`.

## API

See <https://deno.land/x/codemod> for generated API documentation.

## License

[MIT](LICENSE)

---

Made with 💖 by [**@EthanThatOneKid**](https://etok.codes/)
