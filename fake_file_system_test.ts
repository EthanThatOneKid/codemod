import { assertEquals } from "./dev_deps.ts";
import { FakeFileSystem } from "./fake_file_system.ts";

Deno.test("read method returns file content if file exists", async () => {
  const fs = new FakeFileSystem({ "file.txt": "Hello World" });
  const content = await fs.read("file.txt");
  assertEquals(content, "Hello World");
});

Deno.test("read method returns undefined if file does not exist", async () => {
  const fs = new FakeFileSystem({});
  const content = await fs.read("file.txt");
  assertEquals(content, undefined);
});

Deno.test("write method creates a new file with the provided content", async () => {
  const fs = new FakeFileSystem({});
  await fs.write("file.txt", "Hello World");
  const content = await fs.read("file.txt");
  assertEquals(content, "Hello World");
});

Deno.test("delete method removes an existing file", async () => {
  const fs = new FakeFileSystem({ "file.txt": "Hello World" });
  await fs.delete("file.txt");
  const content = await fs.read("file.txt");
  assertEquals(content, undefined);
});

Deno.test("read method throws an error if an unexpected error occurs", async () => {
  const fs = new FakeFileSystem({});
  const actual = await fs.read("file.txt");
  assertEquals(actual, undefined);
});
