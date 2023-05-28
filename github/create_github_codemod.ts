import type {
  GitHubAPIClientOptions,
  GitHubAPITreesPostRequest,
} from "./api/mod.ts";
import type {
  Generate,
  GitHubCodemodBuilderInterface,
  GitHubOpResult,
} from "./github_codemod_builder_interface.ts";
import { GitHubCodemodBuilder } from "./github_codemod_builder.ts";

export async function createGitHubCodemod<
  R extends GitHubOpResult[] = [],
>(
  options: GitHubAPIClientOptions,
  builderOrBuilderGenerate: Generate<
    GitHubCodemodBuilderInterface<R>,
    GitHubCodemodBuilderInterface
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
