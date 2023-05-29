export { errors } from "https://deno.land/std@0.190.0/http/http_errors.ts";

export * from "https://deno.land/x/github_api_types@2023-05-17-05-41/mod.ts";

export {
  applyPatch as applyJSONPatch,
  type Operation as JSONPatchOperation,
} from "https://esm.sh/fast-json-patch@3.1.1";
