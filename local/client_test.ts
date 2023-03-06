import { assertEquals } from "../dev_deps.ts";
import { CodemodType } from "../types.ts";
import { codemod } from "../codemod.ts";

import { Client as LocalClient } from "./client.ts";

/**
 * Removes a list of files and directories from the file system.
 *
 * @param filesAndDirectories - An array of file and directory paths to remove.
 * @throws If any of the files or directories cannot be removed.
 */
export async function cleanup(...filesAndDirectories: string[]): Promise<void> {
  for (const path of filesAndDirectories) {
    try {
      await Deno.remove(path, { recursive: true });
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        // Ignore.
      } else {
        console.error(`Failed to remove ${path}: ${error}`);
        throw error;
      }
    }
  }
}

Deno.test("touch", async () => {
  cleanup("test.txt");

  // Create test.txt.
  await codemod(new LocalClient(), {
    type: CodemodType.TOUCH,
    files: ["test.txt"],
  });

  // Assert that test.txt exists.
  const fileInfo = await Deno.stat("test.txt");
  assertEquals(fileInfo.isFile, true);

  cleanup("test.txt");
});

Deno.test("set", async () => {
  cleanup("test.txt");

  // Create test.txt.
  await codemod(new LocalClient(), {
    type: CodemodType.SET,
    files: ["test.txt"],
    content: "Hello World",
  });

  // Assert that test.txt contains "Hello World".
  const content = await Deno.readTextFile("test.txt");
  assertEquals(content, "Hello World");

  cleanup("test.txt");
});

Deno.test("append", async () => {
  cleanup("test.txt");

  // Create test.txt.
  await codemod(new LocalClient(), {
    type: CodemodType.APPEND,
    files: ["test.txt"],
    content: "Hello World",
  });

  // Assert that test.txt contains "Hello World".
  const content = await Deno.readTextFile("test.txt");
  assertEquals(content, "Hello World");

  cleanup("test.txt");
});

Deno.test("prepend", async () => {
  cleanup("test.txt");

  // Touch test.txt.
  await codemod(new LocalClient(), {
    type: CodemodType.TOUCH,
    files: ["test.txt"],
  });

  // Create test.txt.
  await codemod(new LocalClient(), {
    type: CodemodType.PREPEND,
    files: ["test.txt"],
    content: "Hello World",
  });

  // Assert that test.txt contains "Hello World".
  const content = await Deno.readTextFile("test.txt");
  assertEquals(content, "Hello World");

  cleanup("test.txt");
});

Deno.test("replace", async () => {
  cleanup("test.txt");

  // Create test.txt.
  await codemod(new LocalClient(), {
    type: CodemodType.SET,
    files: ["test.txt"],
    content: "Hello World",
  });

  // Assert that test.txt contains "Hello World".
  let content = await Deno.readTextFile("test.txt");
  assertEquals(content, "Hello World");

  // Replace "Hello World" with "Goodbye World".
  await codemod(new LocalClient(), {
    type: CodemodType.REPLACE,
    files: ["test.txt"],
    regex: /Hello/g,
    replaceWith: "Goodbye",
  });

  // Assert that test.txt contains "Goodbye World".
  content = await Deno.readTextFile("test.txt");
  assertEquals(content, "Goodbye World");

  cleanup("test.txt");
});

Deno.test("delete", async () => {
  cleanup("test.txt");

  // Create test.txt.
  await codemod(new LocalClient(), {
    type: CodemodType.SET,
    files: ["test.txt"],
    content: "Hello World",
  });

  // Assert that test.txt exists.
  const { isFile } = await Deno.stat("test.txt");
  assertEquals(isFile, true);

  // Delete test.txt.
  await codemod(new LocalClient(), {
    type: CodemodType.DELETE,
    files: ["test.txt"],
  });

  // Assert that test.txt does not exist.
  try {
    await Deno.stat("test.txt");
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // Ignore.
    } else {
      throw error;
    }
  }

  cleanup("test.txt");
});

Deno.test("delete non-existent file", async () => {
  cleanup("test.txt");

  // Touch test.txt.
  await codemod(new LocalClient(), {
    type: CodemodType.TOUCH,
    files: ["test.txt"],
  });

  // Assert that test.txt does not exist.
  try {
    await Deno.stat("test.txt");
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // Ignore.
    } else {
      throw error;
    }
  }

  // Delete test.txt.
  await codemod(new LocalClient(), {
    type: CodemodType.DELETE,
    files: ["test.txt"],
  });

  cleanup("test.txt");
});
