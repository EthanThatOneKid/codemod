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
  #base: Generate<string | undefined, []>;
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
      const ref = await generate(this.#base);
      if (ref !== undefined) {
        const baseTreeSHA =
          (await this.api.getBranch({ ref })).commit.commit.tree.sha;
        parents.push(baseTreeSHA);
      }
    }

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

  public base(baseOrBaseGenerate: Generate<string, []>): this {
    this.#base = baseOrBaseGenerate;
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
