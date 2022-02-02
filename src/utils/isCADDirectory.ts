import { join } from "node:path";
import { readFile } from "node:fs/promises";

export async function isCADDirectory(currentDir: string) {
  try {
    const fileLocation = join(currentDir, "package.json");
    const data = await readFile(fileLocation, "utf-8").catch(() => null);

    if (!data) {
      return false;
    }

    const json = JSON.parse(data);
    const name = json.name;

    if (name !== "snailycad") {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}
