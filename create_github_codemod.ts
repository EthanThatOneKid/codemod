import type { GitHubAPIClientOptions } from "./github/api/mod.ts";
import type { Generate } from "./github/types.ts";
import type {
  GitHubCodemodBuilderInterface,
  GitHubOpResult,
} from "./github/mod.ts";
import { GitHubCodemodBuilder } from "./github/mod.ts";

export async function createGitHubCodemod<
  R extends GitHubOpResult[] = [],
>(
  options: GitHubAPIClientOptions,
  builderOrBuilderGenerate: Generate<
    GitHubCodemodBuilderInterface<R>,
    [GitHubCodemodBuilderInterface]
  >,
): Promise<GitHubOpResult[]> {
  const builder = builderOrBuilderGenerate instanceof Function
    ? await builderOrBuilderGenerate(new GitHubCodemodBuilder())
    : builderOrBuilderGenerate;
  return await builder.run(options);
}

/*
 * Example usage:
 */
export const codemod = () =>
  createGitHubCodemod(
    {
      owner: "denoland",
      repo: "deno",
      token: "ghp_1234567890",
    },
    (builder) =>
      builder
        .createTree(() =>
          createGitHubTree(treeOptions, (treeBuilder) =>
            treeBuilder
              .setText("LICENSE", "MIT License")
              .editText(
                "README.md",
                (content) => content.replace("Deno", "DenoLand"),
              ))
        )
        .createCommit(({ 0: tree }) => ({
          message: "Hello, World!",
          tree: tree.sha,
          parents: ["1234567890"],
        })),
  );
