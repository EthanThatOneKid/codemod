export const API_URL = "https://api.github.com";

export function makeContentsURL(
  repo: string,
  file: string,
  branch?: string,
): URL {
  const url = new URL(`/repos/${repo}/contents/${file}`, API_URL);
  if (branch) {
    url.searchParams.set("ref", branch);
  }

  return url;
}

export function makePRURL(repo: string): URL {
  return new URL(`/repos/${repo}/pulls`, API_URL);
}

export function makeCommitURL(repo: string): URL {
  return new URL(`/repos/${repo}/git/commits`, API_URL);
}

export function makeBlobURL(repo: string): URL {
  return new URL(`/repos/${repo}/git/blobs`, API_URL);
}
