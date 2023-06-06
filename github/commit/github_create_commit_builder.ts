import type {
  GitHubAPIClientInterface,
  GitHubAPICommitsPostRequest,
} from "../api/mod.ts";
import type { GitHubCreateCommitBuilderInterface } from "./github_create_commit_builder_interface.ts";
import { Generate, generate } from "../shared/generate.ts";
import { generateObject } from "../shared/generate.ts";

/**
 * GitHubCreateCommitBuilder is a builder for a GitHub create commit request.
 */
export class GitHubCreateCommitBuilder
  implements GitHubCreateCommitBuilderInterface {
  #message: Generate<string, []>;
  #tree: Generate<string, []>;
  #parents: Generate<string[] | undefined, []>;
  #parentRef: Generate<string | undefined, []>;
  #defaultParent: Generate<boolean, []> = false;
  #author: Generate<GitHubAPICommitsPostRequest["author"], []>;
  #committer: Generate<GitHubAPICommitsPostRequest["committer"], []>;
  #signature: Generate<string | undefined, []>;

  constructor(
    private readonly api: GitHubAPIClientInterface,
    options: GitHubAPICommitsPostRequest,
  ) {
    this.#message = options.message;
    this.#tree = options.tree;
    this.#parents = options.parents;
    this.#author = options.author;
    this.#committer = options.committer;
    this.#signature = options.signature;
  }

  public async run(): Promise<GitHubAPICommitsPostRequest> {
    // Parents are an empty array if not specified.
    const parents = await generate(this.#parents) ?? [];

    // If base is specified, generate the base tree SHA.
    if (parents.length === 0) {
      const usingDefault = await generate(this.#defaultParent);
      const parentRef = !usingDefault
        ? await generate(this.#parentRef)
        : (await this.api.getRepository()).default_branch;
      if (parentRef !== undefined) {
        const parentCommitSHA =
          (await this.api.getBranch({ ref: parentRef })).commit.sha;
        parents.push(parentCommitSHA);
      }
    }

    // If defaultBase is specified, generate the default base tree SHA.
    return await generateObject({
      message: this.#message,
      tree: this.#tree,
      parents,
      author: this.#author,
      committer: this.#committer,
      signature: this.#signature,
    }, {
      message: [],
      tree: [],
      parents: [],
      author: [],
      committer: [],
      signature: [],
    });
  }

  public message(messageOrMessageGenerate: Generate<string, []>): this {
    this.#message = messageOrMessageGenerate;
    return this;
  }

  public tree(treeOrTreeGenerate: Generate<string, []>): this {
    this.#tree = treeOrTreeGenerate;
    return this;
  }

  public parents(
    parentsOrParentsGenerate: Generate<string[] | undefined, []>,
  ): this {
    this.#parents = parentsOrParentsGenerate;
    return this;
  }

  public parentRef(parentRefOrParentGenerate: Generate<string, []>): this {
    this.#parentRef = parentRefOrParentGenerate;
    return this;
  }

  public defaultParent(
    defaultParenteOrDefaultParentGenerate?: Generate<boolean, []>,
  ): this {
    this.#defaultParent = defaultParenteOrDefaultParentGenerate ?? true;
    return this;
  }

  public author(
    authorOrAuthorGenerate: Generate<GitHubAPICommitsPostRequest["author"], []>,
  ): this {
    this.#author = authorOrAuthorGenerate;
    return this;
  }

  public committer(
    committerOrCommitterGenerate: Generate<
      GitHubAPICommitsPostRequest["committer"],
      []
    >,
  ): this {
    this.#committer = committerOrCommitterGenerate;
    return this;
  }

  public signature(
    signatureOrSignatureGenerate: Generate<string | undefined, []>,
  ): this {
    this.#signature = signatureOrSignatureGenerate;
    return this;
  }
}
