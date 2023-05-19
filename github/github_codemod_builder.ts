import type {
  GitHubAPIClientInterface,
  GitHubAPIClientOptions,
} from "./api/mod.ts";
import { GitHubAPIClient } from "./api/mod.ts";
import type {
  GitHubCodemodBuilderCreateBranchOptions,
  GitHubCodemodBuilderCreateCommitOptions,
  GitHubCodemodBuilderCreateOrUpdateBranchOptions,
  GitHubCodemodBuilderCreatePROptions,
  GitHubCodemodBuilderCreateTreeOptions,
  GitHubCodemodBuilderInterface,
  GitHubCodemodBuilderUpdateBranchOptions,
} from "./github_codemod_builder_interface.ts";
import type { GitHubCodemods, GitHubTreeResult } from "./tree/mod.ts";
import { GitHubCodemodType } from "./tree/mod.ts";
import { createTree } from "./tree/create.ts";
import type { GitHubCommitResult } from "./commit/mod.ts";
import { createCommit } from "./commit/create.ts";
import type { GitHubBranchResult } from "./branch/mod.ts";
import {
  createBranch,
  createOrUpdateBranch,
  updateBranch,
} from "./branch/mod.ts";
import type { GitHubPRResult } from "./pr/mod.ts";
import { createPR } from "./pr/create.ts";

export class GitHubCodemodBuilder implements GitHubCodemodBuilderInterface {
  private readonly api: GitHubAPIClientInterface;

  constructor(
    private readonly options: GitHubAPIClientOptions,
    private readonly codemods: GitHubCodemods = {},
    private readonly fetcher: typeof fetch = fetch.bind(globalThis),
  ) {
    this.api = new GitHubAPIClient(options, fetcher);
  }

  public setFile(path: string, blob: Blob): this {
    this.codemods[path] = {
      type: GitHubCodemodType.ADD_FILE,
      blob,
    };
    return this;
  }

  public setTextFile(path: string, content: string): this {
    this.codemods[path] = {
      type: GitHubCodemodType.ADD_TEXT_FILE,
      content,
    };
    return this;
  }

  public deleteFile(path: string): this {
    this.codemods[path] = {
      type: GitHubCodemodType.DELETE_FILE,
    };
    return this;
  }

  public clone(): GitHubCodemodBuilderInterface {
    return new GitHubCodemodBuilder(
      this.options,
      { ...this.codemods },
      this.fetcher,
    );
  }

  public async createTree(
    options: GitHubCodemodBuilderCreateTreeOptions = {},
  ): Promise<GitHubTreeResult> {
    return await createTree(
      this.api,
      Object.assign({}, options, { codemods: this.codemods }),
    );
  }

  public async createCommit(
    options: GitHubCodemodBuilderCreateCommitOptions,
  ): Promise<GitHubCommitResult> {
    return await createCommit(
      this.api,
      Object.assign({}, options, { codemods: this.codemods }),
    );
  }

  public async createBranch(
    options: GitHubCodemodBuilderCreateBranchOptions,
  ): Promise<GitHubBranchResult> {
    return await createBranch(
      this.api,
      Object.assign({}, options, { codemods: this.codemods }),
    );
  }

  public async updateBranch(
    options: GitHubCodemodBuilderUpdateBranchOptions,
  ): Promise<GitHubBranchResult> {
    return await updateBranch(
      this.api,
      Object.assign({}, options, { codemods: this.codemods }),
    );
  }

  public async createOrUpdateBranch(
    options: GitHubCodemodBuilderCreateOrUpdateBranchOptions,
  ): Promise<GitHubBranchResult> {
    return await createOrUpdateBranch(
      this.api,
      Object.assign({}, options, { codemods: this.codemods }),
    );
  }

  public async createPR(
    options: GitHubCodemodBuilderCreatePROptions,
  ): Promise<GitHubPRResult> {
    return await createPR(
      this.api,
      Object.assign({}, options, { codemods: this.codemods }),
    );
  }
}
