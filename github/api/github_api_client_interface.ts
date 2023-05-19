import type { paths } from "../../deps.ts";

/**
 * The GitHub API client interface.
 *
 * This interface is used to define the GitHub API client.
 *
 * Privately stores token, owner, and repo.
 */
export interface GitHubAPIClientInterface {
  /**
   * getRawFile gets a raw file from the repository.
   */
  getRawFile(r: GitHubAPIRawFileGetRequest): Promise<Response>;

  /**
   * Gets the default branch name if not passed in by the user.
   *
   * See:
   * https://docs.github.com/en/rest/reference/repos#get-a-repository
   */
  getRepository(): Promise<GitHubAPIRepositoryGetResponse>;

  /**
   * Gets the base tree SHA and commit SHA for the branch.
   *
   * See:
   * https://docs.github.com/en/rest/reference/repos#get-a-branch
   */
  getBranch(
    r: GitHubAPIBranchGetRequest,
  ): Promise<GitHubAPIBranchGetResponse>;

  /**
   * Uploads a blob. The new blob SHA is returned.
   */
  postBlobs(
    r: GitHubAPIBlobsPostRequest,
  ): Promise<GitHubAPIBlobsPostResponse>;

  /**
   * Creates a new tree. Request is made per directory. The new tree SHA is returned.
   *
   * See:
   * https://docs.github.com/en/rest/reference/git#create-a-tree
   */
  postTrees(
    r: GitHubAPITreesPostRequest,
  ): Promise<GitHubAPITreesPostResponse>;

  /**
   * Creates a new commit. The new commit SHA is returned.
   *
   * See:
   * https://docs.github.com/en/rest/reference/git#create-a-commit
   */
  postCommits(
    r: GitHubAPICommitsPostRequest,
  ): Promise<GitHubAPICommitsPostResponse>;

  /**
   * Creates a new branch. The new branch name is returned.
   *
   * See:
   * https://docs.github.com/en/rest/reference/git#create-a-reference
   */
  postRefs(
    r: GitHubAPIRefsPostRequest,
  ): Promise<GitHubAPIRefsPostResponse>;

  /**
   * Updates an existing branch.
   *
   * See:
   * https://docs.github.com/en/rest/git/refs#update-a-reference
   */
  patchRef(
    r: GitHubAPIRefPatchRequest,
  ): Promise<GitHubAPIRefPatchResponse>;

  /**
   * Creates a new PR. The new PR number is returned.
   *
   * See:
   * https://docs.github.com/en/rest/reference/pulls#create-a-pull-request
   */
  postPulls(
    r: GitHubAPIPullsPostRequest,
  ): Promise<GitHubAPIPullsPostResponse>;
}

export interface GitHubAPIRawFileGetRequest {
  branch: string;
  path: string;
}

export type GitHubAPIRepositoryGetResponse =
  paths["/repos/{owner}/{repo}"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

export interface GitHubAPIBranchGetRequest {
  /** branch is the branch passed as the path parameter. */
  branch: string;
}

export type GitHubAPIBranchGetResponse =
  paths["/repos/{owner}/{repo}/branches/{branch}"]["get"]["responses"][
    "200"
  ]["content"]["application/json"];

export type GitHubAPIBlobsPostRequest =
  paths["/repos/{owner}/{repo}/git/blobs"]["post"]["requestBody"]["content"][
    "application/json"
  ];

export type GitHubAPIBlobsPostResponse =
  paths["/repos/{owner}/{repo}/git/blobs"]["post"]["responses"]["201"][
    "content"
  ]["application/json"];

export interface GitHubAPITreeGetRequest {
  /** tree_sha is the tree SHA passed as the path parameter. */
  treeSHA: string;

  /** recursive is the recursive flag passed as the query parameter. */
  recursive?: boolean;
}

export type GitHubAPITreeGetResponse =
  paths["/repos/{owner}/{repo}/git/trees/{tree_sha}"]["get"]["responses"][
    "200"
  ]["content"]["application/json"];

export type GitHubAPITreesPostRequest =
  paths["/repos/{owner}/{repo}/git/trees"]["post"]["requestBody"][
    "content"
  ]["application/json"];

export type GitHubAPITreesPostResponse =
  paths["/repos/{owner}/{repo}/git/trees"]["post"]["responses"]["201"][
    "content"
  ]["application/json"];

export type GitHubAPICommitsPostRequest =
  paths["/repos/{owner}/{repo}/git/commits"]["post"]["requestBody"]["content"][
    "application/json"
  ];

export type GitHubAPICommitsPostResponse =
  paths["/repos/{owner}/{repo}/git/commits"]["post"]["responses"]["201"][
    "content"
  ]["application/json"];

export type GitHubAPIRefsPostRequest =
  paths["/repos/{owner}/{repo}/git/refs"]["post"]["requestBody"]["content"][
    "application/json"
  ];

export type GitHubAPIRefsPostResponse =
  paths["/repos/{owner}/{repo}/git/refs"]["post"]["responses"]["201"][
    "content"
  ]["application/json"];

export type GitHubAPIRefPatchRequest =
  & paths[
    "/repos/{owner}/{repo}/git/refs/{ref}"
  ]["patch"]["requestBody"]["content"]["application/json"]
  & {
    /** ref is the ref passed as the path parameter. */
    ref: string;
  };

export type GitHubAPIRefPatchResponse =
  paths["/repos/{owner}/{repo}/git/refs/{ref}"]["patch"]["responses"]["200"][
    "content"
  ]["application/json"];

export type GitHubAPIPullsPostRequest =
  paths["/repos/{owner}/{repo}/pulls"]["post"]["requestBody"][
    "content"
  ]["application/json"];

export type GitHubAPIPullsPostResponse =
  paths["/repos/{owner}/{repo}/pulls"]["post"]["responses"]["201"][
    "content"
  ]["application/json"];

export type GitHubAPIPullsPullNumberPatchRequest =
  & { pull_number: number }
  & Exclude<
    paths["/repos/{owner}/{repo}/pulls/{pull_number}"]["patch"]["requestBody"],
    undefined
  >[
    "content"
  ]["application/json"];

export type GitHubAPIPullsPullNumberPatchResponse =
  paths["/repos/{owner}/{repo}/pulls/{pull_number}"]["patch"]["responses"][
    "200"
  ]["content"]["application/json"];
