import process from "node:process";
import { execSync } from "node:child_process";
import { __IS_DEV__ } from "../script";

export async function gitPull(currentDir: string) {
  let out: string;

  try {
    out = execSync("git pull origin main", { cwd: currentDir, encoding: "utf-8" });

    if (out.includes("Already up to date.")) {
      console.log("Already up to date.");
      process.exit(0);
    }
  } catch (e: any) {
    if (__IS_DEV__) {
      console.log({ e });
    }

    out = e.stderr.toString();
  }

  if (
    out.includes("Automatic merge failed; fix conflicts and then commit the result.") ||
    out.includes("error: Your local changes to the following files would be overwritten by merge")
  ) {
    console.error(
      "Could not automatically update SnailyCADv4. There are conflicts with with changed files. Please fix these conflicts or get support here: https://discord.gg/eGnrPqEH7U",
    );
    process.exit(0);
  }
}
