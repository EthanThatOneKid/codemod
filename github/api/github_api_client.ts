import type {
  GitHubAPIClientInterface,
  ReposOwnerRepoBranchesBranchGetRequest,
  ReposOwnerRepoBranchesBranchGetResponse,
  ReposOwnerRepoGetResponse,
  ReposOwnerRepoGitBlobsPostRequest,
  ReposOwnerRepoGitBlobsPostResponse,
  ReposOwnerRepoGitCommitsPostRequest,
  ReposOwnerRepoGitCommitsPostResponse,
  ReposOwnerRepoGitRefsPostRequest,
  ReposOwnerRepoGitRefsPostResponse,
  ReposOwnerRepoGitRefsRefPatchRequest,
  ReposOwnerRepoGitRefsRefPatchResponse,
  ReposOwnerRepoGitTreesPostRequest,
  ReposOwnerRepoGitTreesPostResponse,
  ReposOwnerRepoPullsPostRequest,
  ReposOwnerRepoPullsPostResponse,
} from "./github_api_client_interface.ts";
import {
  makeReposOwnerRepoBranchesBranchURL,
  makeReposOwnerRepoGitBlobsURL,
  makeReposOwnerRepoGitCommitsURL,
  makeReposOwnerRepoGitRefsRefURL,
  makeReposOwnerRepoGitRefsURL,
  makeReposOwnerRepoGitTreesURL,
  makeReposOwnerRepoPullsURL,
  makeReposOwnerRepoURL,
} from "./github_api_client_urls.ts";

/**
 * GitHubAPIClientOptions are GitHub API client options.
 */
export interface GitHubAPIClientOptions {
  owner: string;
  repo: string;
  token: string;
}

/**
 * GitHubAPIClient is a client for the GitHub API.
 */
export class GitHubAPIClient implements GitHubAPIClientInterface {
  private readonly fetch: typeof fetch;

  constructor(
    private readonly options: GitHubAPIClientOptions,
    fetcher: typeof fetch,
  ) {
    this.fetch = fetcher;
  }

  public async getReposOwnerRepo(): Promise<ReposOwnerRepoGetResponse> {
    const url = makeReposOwnerRepoURL(this.options.owner, this.options.repo);
    const response = await this.fetch(url, {
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
    const response = await this.fetch(url, {
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

  public async postReposOwnerRepoGitBlobs(
    r: ReposOwnerRepoGitBlobsPostRequest,
  ): Promise<ReposOwnerRepoGitBlobsPostResponse> {
    const url = makeReposOwnerRepoGitBlobsURL(
      this.options.owner,
      this.options.repo,
    );
    const response = await this.fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${this.options.token}`,
      },
      body: JSON.stringify(r),
    });

    if (response.status !== 201) {
      throw new Error(
        `Failed to create blob for ${this.options.owner}/${this.options.repo}.`,
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
    const response = await this.fetch(url, {
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
    const response = await this.fetch(url, {
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
    const response = await this.fetch(url, {
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

  public async patchReposOwnerRepoGitRefsRef(
    r: ReposOwnerRepoGitRefsRefPatchRequest,
  ): Promise<ReposOwnerRepoGitRefsRefPatchResponse> {
    const url = makeReposOwnerRepoGitRefsRefURL(
      this.options.owner,
      this.options.repo,
      r.ref,
    );
    const response = await this.fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${this.options.token}`,
      },
      body: JSON.stringify(r),
    });

    if (response.status !== 200) {
      throw new Error(
        `Failed to update ref for ${this.options.owner}/${this.options.repo}.`,
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
    const response = await this.fetch(url, {
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
