/**
 * Make GitHub API request headers.
 */
export function makeHeaders(token: string): Headers {
  return new Headers({
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
    "X-GitHub-Api-Version": "2022-11-28",
  });
}
