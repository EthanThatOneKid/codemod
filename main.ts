import type { CodemodFlags } from "./flags.ts";
import { parseFlags } from "./flags.ts";
import { CodemodType } from "./types.ts";
import { cm } from "./codemod.ts";
import { Client } from "./local/client.ts";

if (import.meta.main) {
  const flags = parseFlags(Deno.args);
  const client = makeClient(flags.codemod);
  await cm(client, flags.codemod);
}

function makeClient(flags: CodemodFlags): Client {
  console.log({ flags });
  return new Client();
}
