import type {
  GitHubAPIClientInterface,
  GitHubAPICommitsPostRequest,
} from "../api/mod.ts";
import { errors } from "../api/mod.ts";
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
  #parentRef: Generate<string | undefined | null, []>;
  #fallbackRefs: Generate<string | undefined, []>[] = [];
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
    let parentRef = await generate(this.#parentRef);

    // If parents is empty, generate the parent SHA.
    if (parents.length === 0 && parentRef !== null) {
      let sha: string | undefined;

      // Use fallback refs if parentRef is undefined.
      const fallbackRefs = this.#fallbackRefs.slice();
      do {
        sha = !parentRef ? undefined : (
          await this.api.getBranch({ ref: parentRef }).catch((error) => {
            if (
              error instanceof Error &&
              error.message === errors.notFound.message
            ) {
              return undefined;
            }

            throw error;
          })
        )?.commit.sha;

        // If sha is defined, break out of the loop.
        if (sha !== undefined) {
          break;
        }

        parentRef = await generate(fallbackRefs.shift() ?? (() => undefined));
      } while (!sha && fallbackRefs.length > 0);

      if (!sha) {
        parentRef = (await this.api.getRepository()).default_branch;
        sha = (await this.api.getBranch({ ref: parentRef })).commit.sha;
      }

      parents.push(sha);
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

  public parentRef(
    parentRefOrParentGenerate: Generate<string | undefined | null, []>,
    ...fallbackRefs: Generate<string | undefined, []>[]
  ): this {
    this.#parentRef = parentRefOrParentGenerate;
    this.#fallbackRefs = fallbackRefs;
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
