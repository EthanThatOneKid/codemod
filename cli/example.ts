import { expandGlob } from "@std/fs";

export const EXAMPLES = await Array.fromAsync(expandGlob("./examples/*.ts"));

export function getExampleByNumber(exampleNumber: string) {
  return EXAMPLES.find((example) => example.name.startsWith(exampleNumber));
}

if (import.meta.main) {
  const exampleNumber = parseInt(Deno.args[0]).toString().padStart(2, "0");
  const example = getExampleByNumber(exampleNumber);
  if (!example) {
    console.error(`Example "${exampleNumber}" not found.`);
    Deno.exit(1);
  }

  const command = new Deno.Command(
    Deno.execPath(),
    {
      stdout: "inherit",
      args: [
        "run",
        "-A",
        `./examples/${example.name}`,
      ],
    },
  );
  const process = await command.spawn();
  console.log({ output: await process.output() });
}
