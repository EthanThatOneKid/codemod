export * from "https://deno.land/x/github_api_types@2023-05-17-05-41/mod.ts";

export {
  applyPatch as applyJSONPatch,
  type Operation as JSONPatchOperation,
} from "https://cdn.skypack.dev/fast-json-patch@3.1.1/index.mjs?dts";
