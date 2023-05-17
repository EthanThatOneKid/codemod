/** GITHUB_API_URL is the base URL for the GitHub API. */
export const GITHUB_API_URL = new URL("https://api.github.com");

/** makeRepositoryURL returns the desired URL. */
export function makeRepositoryURL(owner: string, repo: string) {
  return new URL(`/repos/${owner}/${repo}`, GITHUB_API_URL);
}

/** makeBranchURL returns the desired URL. */
export function makeBranchURL(
  owner: string,
  repo: string,
  branch: string,
) {
  return new URL(`/repos/${owner}/${repo}/branches/${branch}`, GITHUB_API_URL);
}

/** makeBlobsURL returns the desired URL. */
export function makeBlobsURL(owner: string, repo: string) {
  return new URL(`/repos/${owner}/${repo}/git/blobs`, GITHUB_API_URL);
}

/** makeTreesURL returns the desired URL. */
export function makeTreesURL(owner: string, repo: string) {
  return new URL(`/repos/${owner}/${repo}/git/trees`, GITHUB_API_URL);
}

/** makeCommitsURL returns the desired URL. */
export function makeCommitsURL(
  owner: string,
  repo: string,
) {
  return new URL(`/repos/${owner}/${repo}/git/commits`, GITHUB_API_URL);
}

/** makeRefsURL returns the desired URL. */
export function makeRefsURL(owner: string, repo: string) {
  return new URL(`/repos/${owner}/${repo}/git/refs`, GITHUB_API_URL);
}

/** makeRefURL returns the desired URL. */
export function makeRefURL(
  owner: string,
  repo: string,
  ref: string,
) {
  return new URL(`/repos/${owner}/${repo}/git/refs/${ref}`, GITHUB_API_URL);
}

/** makePullsURL returns the desired URL. */
export function makePullsURL(
  owner: string,
  repo: string,
) {
  return new URL(`/repos/${owner}/${repo}/pulls`, GITHUB_API_URL);
}
