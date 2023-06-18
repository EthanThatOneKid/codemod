import { errors } from "../../deps.ts";
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
  #parentRef: Generate<string | undefined | null, []>;
  #fallbackRefs: Generate<string | undefined, []>[] = [];
  #baseRef: Generate<string | undefined | null, []>;
  #baseFallbackRefs: Generate<string | undefined, []>[] = [];
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
            if (error instanceof errors.NotFound) {
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

    // If the baseBranch is not empty, resolve merge conflicts automatically if
    // the branch is not up to date with a base branch or the default branch.
    let baseRef = await generate(this.#baseRef);
    if (baseRef) {
      let sha: string | undefined;

      // Use fallback refs if baseRef is undefined.
      const fallbackRefs = this.#baseFallbackRefs.slice();
      do {
        sha = !baseRef ? undefined : (
          await this.api.getBranch({ ref: baseRef }).catch((error) => {
            if (error instanceof errors.NotFound) {
              return undefined;
            }

            throw error;
          })
        )?.commit.sha;

        // If sha is defined, break out of the loop.
        if (sha !== undefined) {
          break;
        }

        baseRef = await generate(fallbackRefs.shift() ?? (() => undefined));
      } while (!sha && fallbackRefs.length > 0);

      if (!sha) {
        baseRef = (await this.api.getRepository()).default_branch;
        sha = (await this.api.getBranch({ ref: baseRef })).commit.sha;
      }

      // If the baseRef is not the same as the parentRef, merge the baseRef into
      // the parentRef.
      if (baseRef !== parentRef) {
        // TODO: Create a merge commit.
        // Status: On hold.
      }
    }

    // Return the generated object.
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

  public updateFrom(
    refOrRefGenerate: Generate<string | null | undefined, []>,
    ...fallbackRefs: Generate<string | undefined, []>[]
  ): this {
    this.#parentRef = refOrRefGenerate;
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
