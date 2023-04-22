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
   */
  getReposOwnerRepo(): Promise<ReposOwnerRepoGetResponse>;

  /**
   * Gets the base tree SHA and commit SHA for the branch.
   */
  getReposOwnerRepoBranchesBranch(
    r: ReposOwnerRepoBranchesBranchGetRequest,
  ): Promise<ReposOwnerRepoBranchesBranchGetResponse>;

  // Gets the entire recursive tree for the branch.
  // getReposOwnerRepoGitTreesTreeSHA(
  //   r: ReposOwnerRepoGitTreesTreeSHAGetRequest,
  // ): Promise<ReposOwnerRepoGitTreesTreeSHAGetResponse>;

  // TODO: Stop and check that recursive getReposOwnerRepoGitTreesTreeSHA is working.
  // Update: I actually do not think this is entirely necessary as each file being changed will need to first be fetched
  // individually and then the tree will be built from there and then the tree will be posted for the directory that contains the file.

  /**
   * Creates a new tree. Request is made per directory. The new tree SHA is returned.
   */
  postReposOwnerRepoGitTrees(
    r: ReposOwnerRepoGitTreesPostRequest,
  ): Promise<ReposOwnerRepoGitTreesPostResponse>;

  /**
   * Creates a new commit. The new commit SHA is returned.
   */
  postReposOwnerRepoGitCommits(
    r: ReposOwnerRepoGitCommitsPostRequest,
  ): Promise<ReposOwnerRepoGitCommitsPostResponse>;

  // TODO: Remaining required endpoints: https://youtu.be/nwHqXtk6LHA?t=538
}

export type ReposOwnerRepoGetResponse =
  paths["/repos/{owner}/{repo}"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

export interface ReposOwnerRepoBranchesBranchGetRequest {
  branch: string;
}

export type ReposOwnerRepoBranchesBranchGetResponse =
  paths["/repos/{owner}/{repo}/branches/{branch}"]["get"]["responses"][
    "200"
  ]["content"]["application/json"];

export interface ReposOwnerRepoGitTreesTreeSHAGetRequest {
  treeSHA: string;
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
  paths["/repos/{owner}/{repo}/git/commits"]["post"]["requestBody"][
    "content"
  ]["application/json"];

export type ReposOwnerRepoGitCommitsPostResponse =
  paths["/repos/{owner}/{repo}/git/commits"]["post"]["responses"]["201"][
    "content"
  ]["application/json"];
