import type {
  GitHubAPIBlobsPostRequest,
  GitHubAPIBlobsPostResponse,
  GitHubAPIBranchGetRequest,
  GitHubAPIBranchGetResponse,
  GitHubAPIClientInterface,
  GitHubAPICommitsPostRequest,
  GitHubAPICommitsPostResponse,
  GitHubAPIPullsPostRequest,
  GitHubAPIPullsPostResponse,
  GitHubAPIRefPatchRequest,
  GitHubAPIRefPatchResponse,
  GitHubAPIRefsPostRequest,
  GitHubAPIRefsPostResponse,
  GitHubAPIRepositoryGetResponse,
  GitHubAPITreesPostRequest,
  GitHubAPITreesPostResponse,
} from "./github_api_client_interface.ts";
import {
  makeBlobsURL,
  makeBranchURL,
  makeCommitsURL,
  makePullsURL,
  makeRefsURL,
  makeRefURL,
  makeRepositoryURL,
  makeTreesURL,
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

  public async getRepository(): Promise<GitHubAPIRepositoryGetResponse> {
    const url = makeRepositoryURL(this.options.owner, this.options.repo);
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

  public async getBranch(
    r: GitHubAPIBranchGetRequest,
  ): Promise<GitHubAPIBranchGetResponse> {
    const url = makeBranchURL(
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

  public async postBlobs(
    r: GitHubAPIBlobsPostRequest,
  ): Promise<GitHubAPIBlobsPostResponse> {
    const url = makeBlobsURL(
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

  public async postTrees(
    r: GitHubAPITreesPostRequest,
  ): Promise<GitHubAPITreesPostResponse> {
    const url = makeTreesURL(
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

  public async postCommits(
    r: GitHubAPICommitsPostRequest,
  ): Promise<GitHubAPICommitsPostResponse> {
    const url = makeCommitsURL(
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

  public async postRefs(
    r: GitHubAPIRefsPostRequest,
  ): Promise<GitHubAPIRefsPostResponse> {
    const url = makeRefsURL(
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

  public async patchRef(
    r: GitHubAPIRefPatchRequest,
  ): Promise<GitHubAPIRefPatchResponse> {
    const url = makeRefURL(
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

  public async postPulls(
    r: GitHubAPIPullsPostRequest,
  ): Promise<GitHubAPIPullsPostResponse> {
    const url = makePullsURL(
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
