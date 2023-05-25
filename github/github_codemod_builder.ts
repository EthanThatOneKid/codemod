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
import { GitHubCodemod } from "./tree/types.ts";

// TODO: Make builder for each step to distinguish preop options from
// postop options.

export class GitHubCodemodBuilder implements GitHubCodemodBuilderInterface {
  private readonly api: GitHubAPIClientInterface;
  private readonly codemods: Map<string, GitHubCodemod>;

  constructor(
    private readonly options: GitHubAPIClientOptions,
    codemods: GitHubCodemods = {},
    private readonly fetcher: typeof fetch = fetch.bind(globalThis),
  ) {
    this.api = new GitHubAPIClient(options, fetcher);
    this.codemods = new Map(Object.entries(codemods));
  }

  public setBlob(path: string, blob: Blob): this {
    this.codemods.set(path, {
      type: GitHubCodemodType.SET_BLOB,
      blob,
    });
    return this;
  }

  public setText(path: string, content: string): this {
    this.codemods.set(path, {
      type: GitHubCodemodType.SET_TEXT,
      content,
    });
    return this;
  }

  public editBlob(
    path: string,
    fn: (blob: Blob) => Promise<Blob> | Blob,
  ): this {
    this.codemods.set(path, {
      type: GitHubCodemodType.EDIT_BLOB,
      fn,
    });
    return this;
  }

  public editText(
    path: string,
    fn: (content: string) => Promise<string> | string,
  ): this {
    this.codemods.set(path, {
      type: GitHubCodemodType.EDIT_TEXT,
      fn,
    });
    return this;
  }

  public delete(path: string): this {
    this.codemods.set(path, {
      type: GitHubCodemodType.DELETE,
    });
    return this;
  }

  public clone(): GitHubCodemodBuilderInterface {
    return new GitHubCodemodBuilder(
      this.options,
      Object.fromEntries(this.codemods.entries()),
      this.fetcher,
    );
  }

  public async createTree(
    options: GitHubCodemodBuilderCreateTreeOptions = {},
  ): Promise<GitHubTreeResult> {
    if (this.codemods.size === 0) {
      throw new Error("No codemods to create tree");
    }

    return await createTree(
      this.api,
      Object.assign({}, options, {
        codemods: Object.fromEntries(this.codemods.entries()),
      }),
    );
  }

  public async createCommit(
    options: GitHubCodemodBuilderCreateCommitOptions,
  ): Promise<GitHubCommitResult> {
    if (this.codemods.size === 0) {
      throw new Error("No codemods to create commit");
    }

    return await createCommit(
      this.api,
      Object.assign({}, options, {
        codemods: Object.fromEntries(this.codemods.entries()),
      }),
    );
  }

  public async createBranch(
    options: GitHubCodemodBuilderCreateBranchOptions,
  ): Promise<GitHubBranchResult> {
    if (this.codemods.size === 0) {
      throw new Error("No codemods to create branch");
    }

    return await createBranch(
      this.api,
      Object.assign({}, options, {
        codemods: Object.fromEntries(this.codemods.entries()),
      }),
    );
  }

  public async updateBranch(
    options: GitHubCodemodBuilderUpdateBranchOptions,
  ): Promise<GitHubBranchResult> {
    if (this.codemods.size === 0) {
      throw new Error("No codemods to update branch");
    }

    return await updateBranch(
      this.api,
      Object.assign({}, options, {
        codemods: Object.fromEntries(this.codemods.entries()),
      }),
    );
  }

  public async createOrUpdateBranch(
    options: GitHubCodemodBuilderCreateOrUpdateBranchOptions,
  ): Promise<GitHubBranchResult> {
    if (this.codemods.size === 0) {
      throw new Error("No codemods to create or update branch");
    }

    return await createOrUpdateBranch(
      this.api,
      Object.assign({}, options, {
        codemods: Object.fromEntries(this.codemods.entries()),
      }),
    );
  }

  public async createPR(
    options: GitHubCodemodBuilderCreatePROptions,
  ): Promise<GitHubPRResult> {
    if (this.codemods.size === 0) {
      throw new Error("No codemods to create PR");
    }

    return await createPR(
      this.api,
      Object.assign({}, options, {
        codemods: Object.fromEntries(this.codemods.entries()),
      }),
    );
  }
}
