export const API_URL = "https://api.github.com";

export function makeContentsURL(repo: string, file: string, branch?: string) {
  const url = new URL(`/repos/${repo}/contents/${file}`, API_URL);
  if (branch) {
    url.searchParams.set("ref", branch);
  }

  return url;
}

export function makePRURL(repo: string) {
  return new URL(`/repos/${repo}/pulls`, API_URL);
}
