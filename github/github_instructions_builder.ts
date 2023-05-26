import type {
  GitHubAPIClientInterface,
  GitHubAPIClientOptions,
} from "./api/mod.ts";
import { GitHubAPIClient } from "./api/mod.ts";
import type {
  GitHubInstruction,
  GitHubInstructionsBuilderInterface,
} from "./github_instructions_builder_interface.ts";

/**
 * GitHubInstructionsBuilder is a builder for building a GitHub codemod.
 */
export class GitHubInstructionsBuilder<M, R extends unknown[] = []>
  implements GitHubInstructionsBuilderInterface<M, R> {
  private readonly api: GitHubAPIClientInterface;
  private readonly instructions: GitHubInstruction<R, M>[] = [];

  constructor(
    private readonly options: GitHubAPIClientOptions,
    private readonly fetcher: typeof fetch = fetch.bind(globalThis),
  ) {
    this.api = new GitHubAPIClient(options, fetcher);
  }

  public async execute(): Promise<R> {
    return [] as unknown as R;
  }
}
