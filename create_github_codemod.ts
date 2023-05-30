import type { GitHubAPIClientOptions } from "./github/api/mod.ts";
import type { Generate } from "./github/shared/generate.ts";
import { generate } from "./github/shared/generate.ts";
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
  const builder = await generate(
    builderOrBuilderGenerate,
    new GitHubCodemodBuilder(),
  );
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
        .createTree(
          (_, tree) => tree.addFile("README.md", "Hello, World!"),
        )
        .createCommit(({ 0: tree }) => ({
          message: "Hello, World!",
          tree: tree.sha,
          parents: ["1234567890"],
        })),
  );
