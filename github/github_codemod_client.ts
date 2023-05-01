import type { GitHubAPIClientInterface } from "./api/mod.ts";
import type {
  GitHubBranchClientInterface,
  GitHubCodemodClientInterface,
  GitHubCommitClientInterface,
  GitHubPRClientInterface,
  NewGitHubBranchOptions,
  NewGitHubCommitClientOptions,
  NewGitHubPROptions,
} from "./github_codemod_client_interface.ts";

/**
 * GitHubCodemodClient is a GitHub Codemod client.
 */
export class GitHubCodemodClient implements GitHubCodemodClientInterface {
  constructor(private readonly apiClient: GitHubAPIClientInterface) {}

  public async newCommit(
    options: NewGitHubCommitClientOptions,
  ): Promise<GitHubCommitClientInterface> {
    return Promise.resolve(new GitHubCommitClient(this.apiClient, options));
  }
}

/**
 * GitHubCommitClient is a GitHub commit client.
 */
export class GitHubCommitClient implements GitHubCommitClientInterface {
  constructor(
    private readonly apiClient: GitHubAPIClientInterface,
    private readonly options: NewGitHubCommitClientOptions,
  ) {}

  public async add(path: string, content: string): Promise<void> {
    const [parent, ...mergeParents] = this.options.parents ?? [];
  }

  /**
   * edit edits a file in the commit. The content is passed to the function
   * which returns the new content for the file.
   */
  public async edit(
    path: string,
    fn: (content: string) => string,
  ): Promise<void> {
    const content = await this.apiClient;
  }

  /**
   * newBranch creates a new GitHub branch client.
   */
  public async newBranch(
    options: NewGitHubBranchOptions,
  ): Promise<GitHubBranchClientInterface> {
    return Promise.resolve(new GitHubBranchClient(this.apiClient, options));
  }
}

/**
 * GitHubBranchClient is a GitHub branch client.
 */
export class GitHubBranchClient implements GitHubBranchClientInterface {
  constructor(
    private readonly apiClient: GitHubAPIClientInterface,
    private readonly options: NewGitHubBranchOptions,
  ) {}

  public async newPR(
    options: NewGitHubPROptions,
  ): Promise<GitHubPRClientInterface> {
    throw new Error("Not implemented");
  }
}
