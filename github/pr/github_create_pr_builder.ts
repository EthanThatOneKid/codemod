import type { GitHubAPIPullsPostRequest } from "../api/mod.ts";
import type { Generate } from "../shared/generate.ts";
import { generateObject } from "../shared/generate.ts";
import type { GitHubCreatePRBuilderInterface } from "./github_create_pr_builder_interface.ts";

export class GitHubCreatePRBuilder implements GitHubCreatePRBuilderInterface {
  #title: Generate<string | undefined, []>;
  #head: Generate<string, []>;
  #headRepo: Generate<string | undefined, []>;
  #base: Generate<string, []>;
  #body: Generate<string | undefined, []>;
  #maintainerCanModify: Generate<boolean | undefined, []>;
  #draft: Generate<boolean | undefined, []>;
  #issue: Generate<number | undefined, []>;

  constructor(options: GitHubAPIPullsPostRequest) {
    this.#title = options.title;
    this.#head = options.head;
    this.#headRepo = options.head_repo;
    this.#base = options.base;
    this.#body = options.body;
    this.#maintainerCanModify = options.maintainer_can_modify;
    this.#draft = options.draft;
    this.#issue = options.issue;
  }

  public run(): Promise<GitHubAPIPullsPostRequest> {
    return generateObject({
      title: this.#title,
      head: this.#head,
      head_repo: this.#headRepo,
      base: this.#base,
      body: this.#body,
      maintainer_can_modify: this.#maintainerCanModify,
      draft: this.#draft,
      issue: this.#issue,
    }, {
      title: [],
      head: [],
      head_repo: [],
      base: [],
      body: [],
      maintainer_can_modify: [],
      draft: [],
      issue: [],
    });
  }

  public title(titleOrTitleGenerate: Generate<string | undefined, []>): this {
    this.#title = titleOrTitleGenerate;
    return this;
  }

  public head(headOrHeadGenerate: Generate<string, []>): this {
    this.#head = headOrHeadGenerate;
    return this;
  }

  public headRepo(
    headRepoOrHeadRepoGenerate: Generate<string | undefined, []>,
  ): this {
    this.#headRepo = headRepoOrHeadRepoGenerate;
    return this;
  }

  public base(baseOrBaseGenerate: Generate<string, []>): this {
    this.#base = baseOrBaseGenerate;
    return this;
  }

  public body(bodyOrBodyGenerate: Generate<string | undefined, []>): this {
    this.#body = bodyOrBodyGenerate;
    return this;
  }

  public maintainerCanModify(
    maintainerCanModifyOrMaintainerCanModifyGenerate: Generate<
      boolean | undefined,
      []
    >,
  ): this {
    this.#maintainerCanModify =
      maintainerCanModifyOrMaintainerCanModifyGenerate;
    return this;
  }

  public draft(draftOrDraftGenerate: Generate<boolean | undefined, []>): this {
    this.#draft = draftOrDraftGenerate;
    return this;
  }

  public issue(issueOrIssueGenerate: Generate<number | undefined, []>): this {
    this.#issue = issueOrIssueGenerate;
    return this;
  }
}
