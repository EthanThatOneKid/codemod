import { makeBlobURL } from "./urls.ts";
import { makeHeaders } from "./shared.ts";

/**
 * Create a blob on GitHub.
 *
 * @see https://docs.github.com/en/rest/git/blobs?apiVersion=2022-11-28#create-a-blob
 */
export async function blob(
  repo: string,
  token: string,
  options: BlobOptions,
): Promise<Blob> {
  const url = makeBlobURL(repo);
  const response = await fetch(url, {
    method: "POST",
    headers: makeHeaders(token),
    body: JSON.stringify(options),
  });
  const json = await response.json();
  const data: Blob = {} as Blob;
  console.log({ json });
  return data;
}

/**
 * Options for a blob.
 */
export interface BlobOptions {
  /**
   * The content of the blob.
   */
  content: string;

  /**
   * The encoding used for `content`. Currently, `"utf-8"` and `"base64"`
   * are supported. Default: `"utf-8"`.
   */
  encoding?: "utf-8" | "base64";
}

/**
 * A blob.
 */
export interface Blob {
  /**
   * The URL of the blob.
   */
  url: string;

  /**
   * The SHA of the blob.
   */
  sha: string;
}
