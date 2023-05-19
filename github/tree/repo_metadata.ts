import type { GitHubAPIClientInterface } from "../api/mod.ts";
import type { GitHubRepoMetadataResult } from "./types.ts";

/**
 * getDefaultBranchName gets the default branch name of the repository.
 */
export async function getDefaultBranchName(
  api: GitHubAPIClientInterface,
): Promise<string> {
  return (await api.getRepository()).default_branch;
}

/**
 * getGitHubRepoMetadataResult gets the base branch and possibly the default branch name.
 */
export async function getGitHubRepoMetadataResult(
  api: GitHubAPIClientInterface,
  branchName?: string,
): Promise<GitHubRepoMetadataResult> {
  let defaultBranchName: string | undefined;
  if (!branchName) {
    defaultBranchName = await getDefaultBranchName(api);
    branchName = defaultBranchName;
  }

  const baseBranch = await api.getBranch({
    branch: `refs/heads/${branchName}`,
  });
  return { defaultBranchName, baseBranch };
}
