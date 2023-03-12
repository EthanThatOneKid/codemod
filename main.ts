import type { Flags } from "./flags.ts";
import { parseFlags } from "./flags.ts";
import { Client } from "./client.ts";

if (import.meta.main) {
  const flags = parseFlags(Deno.args);
  const client = makeClient(flags);
  await client.do(flags.codemod);
}

function makeClient(flags: Flags): Client {
  console.log({ flags });
  return new Client();
}
