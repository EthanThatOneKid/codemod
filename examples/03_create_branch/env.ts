import "https://deno.land/x/dotenv@v3.2.2/load.ts";

/**
 * GITHUB_TOKEN authenticates the GitHubAPIClient.
 */
export const GITHUB_TOKEN = String(Deno.env.get("GITHUB_TOKEN"));
