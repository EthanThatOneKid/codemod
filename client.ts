export class Client<VCSInput, VCSOutput> {
  constructor(public readonly input: VCSInput) {}

  public newPR(): PRBuilder<VCSInput, VCSOutput> {
    return new PRBuilder(this, input);
  }
}

interface PRInput<VCSInput> {
  title: string;
  body: string;
  head: string;
  base: string;
  data: VCSInput;
}

export class PRClient<VCSInput, VCSOutput> {
  constructor(public readonly client: Client<VCSInput, VCSOutput>) {}

  public newCommit(): CommitBuilder<VCSInput, VCSOutput> {
    return new CommitBuilder(this);
  }
}
