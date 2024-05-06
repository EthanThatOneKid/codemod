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
 * const results = await createCodemod((builder) =>
 *   builder
 *     .createTree(
 *       (tree) =>
 *         tree
 *           .text("hello_world.txt", "Hello, Ethan!\n")
 *     )
 *     .createCommit(({ 0: tree }) => ({
 *       message: "Add Ethan as a new friend",
 *       tree: tree.sha,
 *     }), (commit) =>
 *       commit
 *         .parentRef("new-branch")
 *         .defaultParent()
 *     )
 *     .createOrUpdateBranch(({ 1: commit }) => ({
 *       ref: "new-branch",
 *       sha: commit.sha,
 *     }))
 *     .maybeCreatePR({
 *       title: "Add Ethan as a new friend",
 *       body: "This is a test PR.",
 *       head: "new-branch",
 *       base: "", // Defaults to repository's default branch.
 *     }), {
 *   owner: "EthanThatOneKid",
 *   repo: "pomo",
 *   token: GITHUB_TOKEN,
 * });
 *
 * console.log(results);
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
