/**
 * CodemodClientInterface is the protocol for a Codemod client.
 *
 * CodemodClientInterface is a wrapper around a GitHubCodemodClientInterface.
 * CodemodClientInterface provides a minimal approach to create commits, branches,
 * and PRs to repositories. If you need more control over the commit, branch, or
 * PR, use the GitHubCodemodClientInterface directly.
 *
 * Future work: Refactor CodemodClientInterface to be version control agnostic.
 * It is assumed that all version control providers have equivalents for GitHub's
 * commit, branch, and PR APIs. CodemodClientInterface is intended to be a
 * normalized interface for creating commits, branches, and PRs.
 */
export interface CodemodClientInterface {
  newCommit(options: NewCodemodCommitOptions): CodemodCommitClientInterface;
}

/**
 * NewCodemodCommitOptions are the options for creating a new commit.
 */
export interface NewCodemodCommitOptions {
  message: string;
  branch: string;
}

/**
 * CodemodCommitClientInterface is the protocol for a codemod commit client.
 */
export interface CodemodCommitClientInterface {
  /**
   * add adds a file to the commit.
   *
   * TODO:
   * Implemented via GitHubCommitClientInterface.add().
   */
  add(path: string, content: string): void;

  /**
   * remove removes a file from the commit.
   *
   * TODO:
   * Implemented via this.add().
   */
  remove(path: string): void;

  /**
   * move moves a file from one path to another.
   *
   * TODO:
   * Implemented via this.add(). See: https://stackoverflow.com/a/72726316.
   */
  move(from: string, to: string): void;

  /**
   * edit edits a file in the commit.
   *
   * TODO: Via GitHubCommitClientInterface.edit().
   */
  edit(path: string, fn: (content: string) => string): Promise<void>;

  /**
   * jsonpatch applies a JSON patch to a file in the commit.
   *
   * TODO: Via this.edit().
   */
  jsonpatch(path: string, value: unknown): Promise<void>;
}

/**
 * NewBranchOptions are the options for creating a new branch.
 */
export interface NewBranchOptions {
  name: string;
  base: string;
}

/**
 * BranchClientInterface is the protocol for a branch client.
 */
export interface BranchClientInterface {
  newPR(options: NewPROptions): Promise<PRClientInterface>;
}

/**
 * NewPROptions are the options for creating a new PR.
 */
export interface NewPROptions {
  title: string;
  body: string;
}

/**
 * PRClientInterface is the protocol for a PR client.
 */
export interface PRClientInterface {
  open(): Promise<PR>;
}

/**
 * PR is a pull request.
 */
export interface PR {
  number: number;
  url: string;
}
