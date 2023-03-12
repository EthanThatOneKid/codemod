import "https://deno.land/x/dotenv@v3.2.2/load.ts";

export { parse } from "https://deno.land/std@0.179.0/flags/mod.ts";
export {
  applyPatch as applyJSONPatch,
  type Operation as JSONPatchOperation,
} from "https://cdn.skypack.dev/fast-json-patch@3.1.1/index.mjs?dts";
