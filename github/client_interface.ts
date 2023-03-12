import type { CodemodClientInterface } from "../client_interface.ts";
// import type { Endpoints } from "./deps.ts";

export interface GitHubClientInterface extends CodemodClientInterface {
  pr(head: string, base: string, options: CreatePROptions): Promise<Response>;
  read(file: string, branch?: string): Promise<Response>;
}

// export type CreateOrUpdateFileContentsOptions =
//   Endpoints["PUT /repos/{owner}/{repo}/contents/{path}"]["parameters"];

// export type GetRepositoryContentOptions =
//   Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["parameters"];

// export type GetRepositoryContentResponse =
//   Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"];

// export type DeleteFileOptions =
//   Endpoints["DELETE /repos/{owner}/{repo}/contents/{path}"]["parameters"];

// export type CreatePRResponse =
//   Endpoints["POST /repos/{owner}/{repo}/pulls"]["response"];

export interface CreatePROptions {
  title?: string | undefined;
  body?: string | undefined;
  maintainer_can_modify?: boolean | undefined;
  draft?: boolean | undefined;
  issue?: number | undefined;
}
