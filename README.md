# Codemod

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https://etok.codes/codemod/raw/main/mod.ts)

Codemod module for making deterministic code modifications.

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
    headBranchName: "hello_world",
  });
```

## API

For generated API documentation, see <https://deno.land/x/codemod>.

## License

[MIT](LICENSE)

---

Made with 💖 by [**@EthanThatOneKid**](https://etok.codes/)
