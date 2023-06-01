import { errors } from "../../deps.ts";
import type {
  GitHubAPIBlobsPostRequest,
  GitHubAPIBlobsPostResponse,
  GitHubAPIBranchGetRequest,
  GitHubAPIBranchGetResponse,
  GitHubAPIClientInterface,
  GitHubAPICommitsPostRequest,
  GitHubAPICommitsPostResponse,
  GitHubAPIContentsGetRequest,
  GitHubAPIContentsGetResponse,
  GitHubAPIPullPatchRequest,
  GitHubAPIPullPatchResponse,
  GitHubAPIPullsGetRequest,
  GitHubAPIPullsGetResponse,
  GitHubAPIPullsPostRequest,
  GitHubAPIPullsPostResponse,
  GitHubAPIRawFileGetRequest,
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
  makeContentsURL,
  makePullsURL,
  makePullURL,
  makeRawFileURL,
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
    fetcher: typeof fetch = fetch.bind(globalThis),
  ) {
    this.fetch = fetcher;
  }

  public async getRawText(r: GitHubAPIRawFileGetRequest): Promise<string> {
    const ref = r.ref ?? (await this.getRepository()).default_branch;
    const url = makeRawFileURL(
      this.options.owner,
      this.options.repo,
      ref,
      r.path,
    );
    const response = await this.fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${this.options.token}`,
      },
    });

    switch (response.status) {
      case 200: {
        return await response.text();
      }

      case 404: {
        throw new errors.NotFound(await response.text());
      }

      default: {
        throw new Error(
          `Failed to get raw file ${this.options.owner}/${this.options.repo}/${ref}/${r.path}. ${await response
            .text()}`,
        );
      }
    }
  }

  public async getRawBlob(r: GitHubAPIRawFileGetRequest): Promise<Blob> {
    const ref = r.ref ?? (await this.getRepository()).default_branch;
    const url = makeRawFileURL(
      this.options.owner,
      this.options.repo,
      ref,
      r.path,
    );
    const response = await this.fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${this.options.token}`,
      },
    });

    switch (response.status) {
      case 200: {
        return await response.blob();
      }

      case 404: {
        throw new errors.NotFound(await response.text());
      }

      default: {
        throw new Error(
          `Failed to get raw file ${this.options.owner}/${this.options.repo}/${ref}/${r.path}. ${await response
            .text()}`,
        );
      }
    }
  }

  public async getContents(
    r: GitHubAPIContentsGetRequest,
  ): Promise<GitHubAPIContentsGetResponse> {
    const url = makeContentsURL(
      this.options.owner,
      this.options.repo,
      r.ref,
      r.path,
    );
    const response = await this.fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${this.options.token}`,
      },
    });

    switch (response.status) {
      case 200: {
        return await response.json();
      }

      case 302:
      case 404: {
        throw new errors.NotFound(await response.text());
      }

      case 403: {
        throw new errors.Forbidden(await response.text());
      }

      default: {
        throw new Error(
          `Failed to get contents ${this.options.owner}/${this.options.repo}/${r.path}. ${await response
            .text()}`,
        );
      }
    }
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

    switch (response.status) {
      case 200: {
        return await response.json();
      }

      case 301:
      case 404: {
        throw new errors.NotFound(await response.text());
      }

      case 403: {
        throw new errors.Forbidden(await response.text());
      }

      default: {
        throw new Error(
          `Failed to get repository ${this.options.owner}/${this.options.repo}. ${await response
            .text()}`,
        );
      }
    }
  }

  public async getBranch(
    r: GitHubAPIBranchGetRequest,
  ): Promise<GitHubAPIBranchGetResponse> {
    const url = makeBranchURL(
      this.options.owner,
      this.options.repo,
      r.ref,
    );
    const response = await this.fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${this.options.token}`,
      },
    });

    switch (response.status) {
      case 200: {
        return await response.json();
      }

      case 301:
      case 404: {
        throw new errors.NotFound(await response.text());
      }

      default: {
        throw new Error(
          `Failed to get branch ${this.options.owner}/${this.options.repo}/${r.ref}. ${await response
            .text()}`,
        );
      }
    }
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

    switch (response.status) {
      case 201: {
        return await response.json();
      }

      case 403: {
        throw new errors.Forbidden(await response.text());
      }

      case 404: {
        throw new errors.NotFound(await response.text());
      }

      case 409: {
        throw new errors.Conflict(await response.text());
      }

      case 422: {
        throw new errors.UnprocessableEntity(await response.text());
      }

      default: {
        throw new Error(
          `Failed to create blob for ${this.options.owner}/${this.options.repo}. ${await response
            .text()}`,
        );
      }
    }
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

    switch (response.status) {
      case 201: {
        return await response.json();
      }

      case 403: {
        throw new errors.Forbidden(await response.text());
      }

      case 404: {
        throw new errors.NotFound(await response.text());
      }

      case 422: {
        throw new errors.UnprocessableEntity(await response.text());
      }

      default: {
        throw new Error(
          `Failed to create tree for ${this.options.owner}/${this.options.repo}. ${await response
            .text()}`,
        );
      }
    }
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

    switch (response.status) {
      case 201: {
        return await response.json();
      }

      case 404: {
        throw new errors.NotFound(await response.text());
      }

      case 422: {
        throw new errors.UnprocessableEntity(await response.text());
      }

      default: {
        throw new Error(
          `Failed to create commit for ${this.options.owner}/${this.options.repo}. ${await response
            .text()}`,
        );
      }
    }
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

    switch (response.status) {
      case 201: {
        return await response.json();
      }

      case 422: {
        throw new errors.UnprocessableEntity(await response.text());
      }

      default: {
        throw new Error(
          `Failed to create ref for ${this.options.owner}/${this.options.repo}. ${await response
            .text()}`,
        );
      }
    }
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

    switch (response.status) {
      case 200: {
        return await response.json();
      }

      case 422: {
        throw new errors.UnprocessableEntity(await response.text());
      }

      default: {
        throw new Error(
          `Failed to update ref for ${this.options.owner}/${this.options.repo}. ${await response
            .text()}`,
        );
      }
    }
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

    switch (response.status) {
      case 201: {
        return await response.json();
      }

      case 403: {
        throw new errors.Forbidden(await response.text());
      }

      case 422: {
        throw new errors.UnprocessableEntity(await response.text());
      }

      default: {
        throw new Error(
          `Failed to create pull request for ${this.options.owner}/${this.options.repo}. ${await response
            .text()}`,
        );
      }
    }
  }

  public async getPulls(
    r: GitHubAPIPullsGetRequest,
  ): Promise<GitHubAPIPullsGetResponse> {
    const url = makePullsURL(
      this.options.owner,
      this.options.repo,
    );

    if (r.base) {
      url.searchParams.set("base", r.base);
    }

    if (r.direction) {
      url.searchParams.set("direction", r.direction);
    }

    if (r.head) {
      url.searchParams.set("head", r.head);
    }

    if (r.page) {
      url.searchParams.set("page", r.page?.toString());
    }

    if (r.per_page) {
      url.searchParams.set("per_page", r.per_page?.toString());
    }

    if (r.sort) {
      url.searchParams.set("sort", r.sort);
    }

    if (r.state) {
      url.searchParams.set("state", r.state);
    }

    const response = await this.fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${this.options.token}`,
      },
    });

    switch (response.status) {
      case 200: {
        return await response.json();
      }

      case 304: {
        throw new Error("Not modified");
      }

      case 422: {
        throw new errors.UnprocessableEntity(await response.text());
      }

      default: {
        throw new Error(
          `Failed to get pull requests for ${this.options.owner}/${this.options.repo}. ${await response
            .text()}`,
        );
      }
    }
  }

  public async patchPull(
    r: GitHubAPIPullPatchRequest,
  ): Promise<GitHubAPIPullPatchResponse> {
    const pullsResult = await this.getPulls({ head: r.head, base: r.base });
    if (pullsResult.length === 0) {
      throw new Error(
        `Failed to find pull request for ${this.options.owner}/${this.options.repo}.`,
      );
    }

    if (pullsResult.length > 1) {
      throw new Error(
        `Found multiple pull requests for ${this.options.owner}/${this.options.repo}. This should not happen.`,
      );
    }

    const url = makePullURL(
      this.options.owner,
      this.options.repo,
      pullsResult[0].number,
    );
    const response = await this.fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${this.options.token}`,
      },
      body: JSON.stringify(r),
    });

    switch (response.status) {
      case 200: {
        return await response.json();
      }

      case 403: {
        throw new errors.Forbidden(await response.text());
      }

      case 422: {
        throw new errors.UnprocessableEntity(await response.text());
      }

      default: {
        throw new Error(
          `Failed to update pull request for ${this.options.owner}/${this.options.repo}. ${await response
            .text()}`,
        );
      }
    }
  }
}
