import type { GitHubAPIClientOptions } from "./api/mod.ts";
import type {
  GitHubCodemodBuilderInterface,
  GitHubOpResult,
} from "./codemod/mod.ts";
import { GitHubCodemodBuilder } from "./codemod/mod.ts";
import type { Generate } from "./shared/generate.ts";
import { generate } from "./shared/generate.ts";

/**
 * Creates a codemod builder and runs it.
 *
 * @example
 * ```ts
 * const codemod = await createCodemod((builder) =>
 *  builder
 *   .updatePR({
 *    title: "Updated title",
 *    number: 27,
 *  }), {
 *  owner: "EthanThatOneKid",
 *  repo: "pomo",
 *  token: GITHUB_TOKEN,
 * });
 * ```
 */
export async function createCodemod<R extends GitHubOpResult[]>(
  builderOrBuilderGenerate: Generate<
    GitHubCodemodBuilderInterface<R>,
    [GitHubCodemodBuilderInterface]
  >,
  options: GitHubAPIClientOptions,
): Promise<R> {
  const builder = await generate(
    builderOrBuilderGenerate,
    new GitHubCodemodBuilder(options),
  );
  return await builder.run();
}
