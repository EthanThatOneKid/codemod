# Codemod

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https://etok.codes/codemod/raw/main/mod.ts)

Codemod module for making deterministic code modifications on GitHub.

## Usage

```ts
import { GitHubCodemodBuilder } from "https://deno.land/x/codemod/github/mod.ts";

const result = await new GitHubCodemodBuilder({
  owner: "EthanThatOneKid",
  repo: "codemod",
  token: GITHUB_TOKEN,
})
  .setTextFile("hello_world.txt", "Hello, World!")
  .createPR({
    title: "Hello, World!",
    body: "This is a test PR.",
    message: "Create hello_world.txt",
    newBranchName: "hello-world",
  });
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
