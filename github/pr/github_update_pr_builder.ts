import type { GitHubAPIPullPatchRequest } from "../api/mod.ts";
import type { Generate } from "../shared/generate.ts";
import { generateObject } from "../shared/generate.ts";
import type { GitHubUpdatePRBuilderInterface } from "./github_update_pr_builder_interface.ts";

export class GitHubUpdatePRBuilder implements GitHubUpdatePRBuilderInterface {
  #title: Generate<string | undefined, []>;
  #number: Generate<number, []>;
  #body: Generate<string | undefined, []>;
  #state: Generate<GitHubAPIPullPatchRequest["state"], []>;
  #base: Generate<string | undefined, []>;
  #maintainerCanModify: Generate<boolean | undefined, []>;

  constructor(options: GitHubAPIPullPatchRequest) {
    this.#title = options.title;
    this.#number = options.number;
    this.#body = options.body;
    this.#state = options.state;
    this.#base = options.base;
    this.#maintainerCanModify = options.maintainer_can_modify;
  }

  public run(): Promise<GitHubAPIPullPatchRequest> {
    return generateObject({
      title: this.#title,
      number: this.#number,
      body: this.#body,
      state: this.#state,
      base: this.#base,
      maintainer_can_modify: this.#maintainerCanModify,
    }, {
      title: [],
      number: [],
      body: [],
      state: [],
      base: [],
      maintainer_can_modify: [],
    });
  }

  public title(titleOrTitleGenerate: Generate<string | undefined, []>): this {
    this.#title = titleOrTitleGenerate;
    return this;
  }

  public number(numberOrNumberGenerate: Generate<number, []>): this {
    this.#number = numberOrNumberGenerate;
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

  public state(
    stateOrStateGenerate: Generate<GitHubAPIPullPatchRequest["state"], []>,
  ): this {
    this.#state = stateOrStateGenerate;
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
}
