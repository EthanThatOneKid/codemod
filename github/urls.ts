export const API_URL = "https://api.github.com";

export function makeContentsURL(repo: string, branch: string, file: string) {
  const url = new URL(`/repos/${repo}/contents/${file}`, API_URL);
  url.searchParams.set("ref", branch);
  return url;
}

export function makePRURL(repo: string) {
  return new URL(`/repos/${repo}/pulls`, API_URL);
}
