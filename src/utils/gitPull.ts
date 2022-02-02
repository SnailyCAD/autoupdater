import process from "node:process";
import { execSync } from "node:child_process";

export async function gitPull(currentDir: string) {
  let out: string;

  try {
    out = execSync("git pull origin main", { cwd: currentDir, encoding: "utf-8" });

    if (out.includes("Already up to date.")) {
      console.log("Already up to date.");
      process.exit(0);
    }
  } catch (e: any) {
    console.log({ e });
    out = e.stderr.toString();
  }

  if (out.includes("Automatic merge failed; fix conflicts and then commit the result.")) {
    console.error(
      "Could not automatically update SnailyCADv4. There are conflicts with with changed files. Please fix these conflicts or get support here: https://discord.gg/eGnrPqEH7U",
    );
    process.exit(0);
  }
}
