/** GITHUB_API_URL is the base URL for the GitHub API. */
export const GITHUB_API_URL = new URL("https://api.github.com");

/** makeReposOwnerRepoURL returns the desired URL. */
export function makeReposOwnerRepoURL(owner: string, repo: string) {
  return new URL(`/repos/${owner}/${repo}`, GITHUB_API_URL);
}

/** makeReposOwnerRepoBranchesBranchURL returns the desired URL. */
export function makeReposOwnerRepoBranchesBranchURL(
  owner: string,
  repo: string,
  branch: string,
) {
  return new URL(`/repos/${owner}/${repo}/branches/${branch}`, GITHUB_API_URL);
}

/** makeReposOwnerRepoGitTreesTreeSHAURL returns the desired URL. */
export function makeReposOwnerRepoGitTreesURL(owner: string, repo: string) {
  return new URL(`/repos/${owner}/${repo}/git/trees`, GITHUB_API_URL);
}

/** makeReposOwnerRepoGitTreesTreeSHAURL returns the desired URL. */
export function makeReposOwnerRepoGitCommitsURL(
  owner: string,
  repo: string,
) {
  return new URL(`/repos/${owner}/${repo}/git/commits`, GITHUB_API_URL);
}
