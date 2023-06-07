import type { GitHubAPIClientOptions } from "./api/mod.ts";
import type {
  GitHubCodemodBuilderInterface,
  GitHubOpResult,
} from "./codemod/mod.ts";
import { GitHubCodemodBuilder } from "./codemod/mod.ts";
import type { Generate } from "./shared/generate.ts";
import { generate } from "./shared/generate.ts";

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
