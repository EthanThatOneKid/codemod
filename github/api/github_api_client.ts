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
 * GitHub API client options.
 */
export interface GitHubAPIClientOptions {
  owner: string;
  repo: string;
  token: string;
}

/**
 * Client is a client for the GitHub API.
 */
export class GitHubAPIClient implements GitHubAPIClientInterface {
  constructor(
    private readonly options: GitHubAPIClientOptions,
  ) {}

  public async getReposOwnerRepo(): Promise<ReposOwnerRepoGetResponse> {
    const url = makeReposOwnerRepoURL(this.options.owner, this.options.repo);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${this.options.token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        `Failed to get default branch for ${this.options.owner}/${this.options.repo}.`,
      );
    }

    return await response.json();
  }

  public async getReposOwnerRepoBranchesBranch(
    r: ReposOwnerRepoBranchesBranchGetRequest,
  ): Promise<ReposOwnerRepoBranchesBranchGetResponse> {
    const url = makeReposOwnerRepoBranchesBranchURL(
      this.options.owner,
      this.options.repo,
      r.branch,
    );
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${this.options.token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        `Failed to get base tree SHA and commit SHA for ${this.options.owner}/${this.options.repo} branch ${r.branch}.`,
      );
    }

    return await response.json();
  }

  public async postReposOwnerRepoGitTrees(
    r: ReposOwnerRepoGitTreesPostRequest,
  ): Promise<ReposOwnerRepoGitTreesPostResponse> {
    const url = makeReposOwnerRepoGitTreesURL(
      this.options.owner,
      this.options.repo,
    );
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${this.options.token}`,
      },
      body: JSON.stringify(r),
    });

    if (response.status !== 201) {
      throw new Error(
        `Failed to create tree for ${this.options.owner}/${this.options.repo}.`,
      );
    }

    return await response.json();
  }

  public async postReposOwnerRepoGitCommits(
    r: ReposOwnerRepoGitCommitsPostRequest,
  ): Promise<ReposOwnerRepoGitCommitsPostResponse> {
    const url = makeReposOwnerRepoGitCommitsURL(
      this.options.owner,
      this.options.repo,
    );
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${this.options.token}`,
      },
      body: JSON.stringify(r),
    });

    if (response.status !== 201) {
      throw new Error(
        `Failed to create commit for ${this.options.owner}/${this.options.repo}.`,
      );
    }

    return await response.json();
  }

  public async postReposOwnerRepoGitRefs(
    r: ReposOwnerRepoGitRefsPostRequest,
  ): Promise<ReposOwnerRepoGitRefsPostResponse> {
    const url = makeReposOwnerRepoGitRefsURL(
      this.options.owner,
      this.options.repo,
    );
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${this.options.token}`,
      },
      body: JSON.stringify(r),
    });

    if (response.status !== 201) {
      throw new Error(
        `Failed to create ref for ${this.options.owner}/${this.options.repo}.`,
      );
    }

    return await response.json();
  }

  public async postReposOwnerRepoPulls(
    r: ReposOwnerRepoPullsPostRequest,
  ): Promise<ReposOwnerRepoPullsPostResponse> {
    const url = makeReposOwnerRepoPullsURL(
      this.options.owner,
      this.options.repo,
    );
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${this.options.token}`,
      },
      body: JSON.stringify(r),
    });

    if (response.status !== 201) {
      throw new Error(
        `Failed to create pull request for ${this.options.owner}/${this.options.repo}.`,
      );
    }

    return await response.json();
  }
}
