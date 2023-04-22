import type { GitHubCodemodClientInterface } from "./github/github_codemod_client_interface.ts";
import type { CodemodClientInterface } from "./codemod_client_interface.ts";

export class CodemodClient implements CodemodClientInterface {
  constructor(
    private readonly githubCodemodClient: GitHubCodemodClientInterface,
  ) {}
}
