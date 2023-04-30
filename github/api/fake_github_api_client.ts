import type {
  GitHubAPIClientInterface,
  ReposOwnerRepoBranchesBranchGetRequest,
  ReposOwnerRepoBranchesBranchGetResponse,
  ReposOwnerRepoGetResponse,
  ReposOwnerRepoGitCommitsPostRequest,
  ReposOwnerRepoGitCommitsPostResponse,
  ReposOwnerRepoGitRefsPostRequest,
  ReposOwnerRepoGitRefsPostResponse,
  ReposOwnerRepoGitTreesPostRequest,
  ReposOwnerRepoGitTreesPostResponse,
  ReposOwnerRepoPullsPostRequest,
  ReposOwnerRepoPullsPostResponse,
} from "./github_api_client_interface.ts";
import {
  makeReposOwnerRepoBranchesBranchURL,
  makeReposOwnerRepoGitCommitsURL,
  makeReposOwnerRepoGitRefsURL,
  makeReposOwnerRepoGitTreesURL,
  makeReposOwnerRepoPullsURL,
  makeReposOwnerRepoURL,
} from "./github_api_client_urls.ts";

/**
 * FakeGitHubAPIClientData is the data for a fake GitHub Codemod client.
 */
export interface FakeGitHubAPIClientData {
  repository: ReposOwnerRepoGetResponse;
  branches: ReposOwnerRepoBranchesBranchGetResponse[];
}

/**
 * FakeGitHubAPIClient is a client for the GitHub API.
 */
export class FakeGitHubAPIClient implements GitHubAPIClientInterface {
  constructor(
    private readonly data: FakeGitHubAPIClientData,
  ) {}

  public async getReposOwnerRepo(): Promise<ReposOwnerRepoGetResponse> {
    return Promise.resolve(this.data.repository);
  }

  public async getReposOwnerRepoBranchesBranch(
    r: ReposOwnerRepoBranchesBranchGetRequest,
  ): Promise<ReposOwnerRepoBranchesBranchGetResponse> {
    const branch = this.data.branches.find(({ name }) => name === r.branch);
    if (!branch) {
      throw new Error(
        `Failed to get branch ${r.branch} for ${this.data.repository.full_name}.`,
      );
    }

    return Promise.resolve(branch);
  }

  public async postReposOwnerRepoGitTrees(
    r: ReposOwnerRepoGitTreesPostRequest,
  ): Promise<ReposOwnerRepoGitTreesPostResponse> {
  }

  public async postReposOwnerRepoGitCommits(
    r: ReposOwnerRepoGitCommitsPostRequest,
  ): Promise<ReposOwnerRepoGitCommitsPostResponse> {
  }

  public async postReposOwnerRepoGitRefs(
    r: ReposOwnerRepoGitRefsPostRequest,
  ): Promise<ReposOwnerRepoGitRefsPostResponse> {
  }

  public async postReposOwnerRepoPulls(
    r: ReposOwnerRepoPullsPostRequest,
  ): Promise<ReposOwnerRepoPullsPostResponse> {
  }
}
