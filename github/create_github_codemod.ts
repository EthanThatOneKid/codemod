import type { GitHubAPIClientOptions } from "./api/mod.ts";
import type {
  Generate,
  GitHubOpResult,
} from "./github_codemod_builder_interface.ts";
import { GitHubCodemodBuilder } from "./github_codemod_builder.ts";

export async function createGitHubCodemod<M>(
  options: GitHubAPIClientOptions,
  // TODO: Infer the R from the mapped result <https://youtu.be/3Fxoxg_FMpg>.
  builderOrBuilderGenerate: GitHubCodemodBuilder<M, >
  Generate<
    GitHubCodemodBuilder<M>,
    GitHubCodemodBuilder<M, GitHubOpResult[]>
  >,
): Promise<GitHubOpResult<M>[]> {
  const builder = builderOrBuilderGenerate instanceof Function
    ? await builderOrBuilderGenerate(new GitHubCodemodBuilder(options))
    : builderOrBuilderGenerate;
  return await builder.run();
}
