import { load } from "../../deps.ts";

await load();

/**
 * GITHUB_TOKEN authenticates the GitHubAPIClient.
 */
export const GITHUB_TOKEN = String(Deno.env.get("GITHUB_TOKEN"));
