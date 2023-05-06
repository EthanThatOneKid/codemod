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
   * Gets the default branch name if not passed in by the user.
   *
   * See:
   * https://docs.github.com/en/rest/reference/repos#get-a-repository
   */
  getReposOwnerRepo(): Promise<ReposOwnerRepoGetResponse>;

  /**
   * Gets the base tree SHA and commit SHA for the branch.
   *
   * See:
   * https://docs.github.com/en/rest/reference/repos#get-a-branch
   */
  getReposOwnerRepoBranchesBranch(
    r: ReposOwnerRepoBranchesBranchGetRequest,
  ): Promise<ReposOwnerRepoBranchesBranchGetResponse>;

  /**
   * Uploads a blob. The new blob SHA is returned.
   */
  postReposOwnerRepoGitBlobs(
    r: ReposOwnerRepoGitBlobsPostRequest,
  ): Promise<ReposOwnerRepoGitBlobsPostResponse>;

  /**
   * Creates a new tree. Request is made per directory. The new tree SHA is returned.
   *
   * See:
   * https://docs.github.com/en/rest/reference/git#create-a-tree
   */
  postReposOwnerRepoGitTrees(
    r: ReposOwnerRepoGitTreesPostRequest,
  ): Promise<ReposOwnerRepoGitTreesPostResponse>;

  /**
   * Creates a new commit. The new commit SHA is returned.
   *
   * See:
   * https://docs.github.com/en/rest/reference/git#create-a-commit
   */
  postReposOwnerRepoGitCommits(
    r: ReposOwnerRepoGitCommitsPostRequest,
  ): Promise<ReposOwnerRepoGitCommitsPostResponse>;

  /**
   * Creates a new branch. The new branch name is returned.
   *
   * See:
   * https://docs.github.com/en/rest/reference/git#create-a-reference
   */
  postReposOwnerRepoGitRefs(
    r: ReposOwnerRepoGitRefsPostRequest,
  ): Promise<ReposOwnerRepoGitRefsPostResponse>;

  /**
   * Updates an existing branch.
   *
   * See:
   * https://docs.github.com/en/rest/git/refs#update-a-reference
   */
  patchReposOwnerRepoGitRefsRef(
    r: ReposOwnerRepoGitRefsRefPatchRequest,
  ): Promise<ReposOwnerRepoGitRefsRefPatchResponse>;

  /**
   * Creates a new PR. The new PR number is returned.
   *
   * See:
   * https://docs.github.com/en/rest/reference/pulls#create-a-pull-request
   */
  postReposOwnerRepoPulls(
    r: ReposOwnerRepoPullsPostRequest,
  ): Promise<ReposOwnerRepoPullsPostResponse>;
}

export type ReposOwnerRepoGetResponse =
  paths["/repos/{owner}/{repo}"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

export interface ReposOwnerRepoBranchesBranchGetRequest {
  /** branch is the branch passed as the path parameter. */
  branch: string;
}

export type ReposOwnerRepoBranchesBranchGetResponse =
  paths["/repos/{owner}/{repo}/branches/{branch}"]["get"]["responses"][
    "200"
  ]["content"]["application/json"];

export type ReposOwnerRepoGitBlobsPostRequest =
  paths["/repos/{owner}/{repo}/git/blobs"]["post"]["requestBody"]["content"][
    "application/json"
  ];

export type ReposOwnerRepoGitBlobsPostResponse =
  paths["/repos/{owner}/{repo}/git/blobs"]["post"]["responses"]["201"][
    "content"
  ]["application/json"];

export interface ReposOwnerRepoGitTreesTreeSHAGetRequest {
  /** tree_sha is the tree SHA passed as the path parameter. */
  treeSHA: string;

  /** recursive is the recursive flag passed as the query parameter. */
  recursive?: boolean;
}

export type ReposOwnerRepoGitTreesTreeSHAGetResponse =
  paths["/repos/{owner}/{repo}/git/trees/{tree_sha}"]["get"]["responses"][
    "200"
  ]["content"]["application/json"];

export type ReposOwnerRepoGitTreesPostRequest =
  paths["/repos/{owner}/{repo}/git/trees"]["post"]["requestBody"][
    "content"
  ]["application/json"];

export type ReposOwnerRepoGitTreesPostResponse =
  paths["/repos/{owner}/{repo}/git/trees"]["post"]["responses"]["201"][
    "content"
  ]["application/json"];

export type ReposOwnerRepoGitCommitsPostRequest =
  paths["/repos/{owner}/{repo}/git/commits"]["post"]["requestBody"]["content"][
    "application/json"
  ];

export type ReposOwnerRepoGitCommitsPostResponse =
  paths["/repos/{owner}/{repo}/git/commits"]["post"]["responses"]["201"][
    "content"
  ]["application/json"];

export type ReposOwnerRepoGitRefsPostRequest =
  paths["/repos/{owner}/{repo}/git/refs"]["post"]["requestBody"]["content"][
    "application/json"
  ];

export type ReposOwnerRepoGitRefsPostResponse =
  paths["/repos/{owner}/{repo}/git/refs"]["post"]["responses"]["201"][
    "content"
  ]["application/json"];

export type ReposOwnerRepoGitRefsRefPatchRequest =
  & paths[
    "/repos/{owner}/{repo}/git/refs/{ref}"
  ]["patch"]["requestBody"]["content"]["application/json"]
  & {
    /** ref is the ref passed as the path parameter. */
    ref: string;
  };

export type ReposOwnerRepoGitRefsRefPatchResponse =
  paths["/repos/{owner}/{repo}/git/refs/{ref}"]["patch"]["responses"]["200"][
    "content"
  ]["application/json"];

export type ReposOwnerRepoPullsPostRequest =
  paths["/repos/{owner}/{repo}/pulls"]["post"]["requestBody"][
    "content"
  ]["application/json"];

export type ReposOwnerRepoPullsPostResponse =
  paths["/repos/{owner}/{repo}/pulls"]["post"]["responses"]["201"][
    "content"
  ]["application/json"];
