import type { GitHubAPIClientInterface } from "./api/mod.ts";
import type {
  GitHubCodemodBuilderCreateBranchOptions,
  GitHubCodemodBuilderCreateCommitOptions,
  GitHubCodemodBuilderCreateOrUpdateBranchOptions,
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
import type { GitHubCreatePROptions, GitHubPRResult } from "./pr/mod.ts";
import { createPR } from "./pr/create.ts";

export class GitHubCodemodBuilder implements GitHubCodemodBuilderInterface {
  constructor(
    private readonly api: GitHubAPIClientInterface,
    private readonly codemods: GitHubCodemods = {},
  ) {}

  public addFile(path: string, blob: Blob): this {
    this.codemods[path] = {
      type: GitHubCodemodType.ADD_FILE,
      blob,
    };
    return this;
  }

  public addTextFile(path: string, content: string): this {
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
    options: GitHubCreatePROptions,
  ): Promise<GitHubPRResult> {
    return await createPR(
      this.api,
      Object.assign({}, options, { codemods: this.codemods }),
    );
  }
}