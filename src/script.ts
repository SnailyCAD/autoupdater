import process from "node:process";
import { execSync } from "node:child_process";
import { isCADDirectory } from "./utils/isCADDirectory.js";
import { gitPull } from "./utils/gitPull.js";
import inquirer from "inquirer";
import { resolve } from "node:path";

export const __IS_DEV__ = process.env.NODE_ENV === "development";

main()
  .then(() => process.exit(0))
  .catch((e) => {
    const stdout = e?.stdout;
    const message = Buffer.from(stdout).toString("utf8");
    console.error(message || e);

    process.exit(1);
  });

async function main() {
  const cwd = process.cwd();
  const isCADDir = await isCADDirectory(cwd);

  const currentDir = isCADDir
    ? cwd
    : resolve(
        cwd,
        (
          await inquirer.prompt<{ dir: string }>([
            {
              type: "input",
              name: "dir",
              message: "Please enter the CAD's directory?",
              default: "./snaily-cadv4",
            },
          ])
        ).dir,
      );

  if (__IS_DEV__) {
    console.log({ currentDir });
  }

  // git pull origin main
  await gitPull(currentDir);

  // install dependencies
  console.log("Installing dependencies... (this may take a few minutes)");
  execSync("pnpm install", { cwd: currentDir });

  // copy .env file to client & api
  execSync("node scripts/copy-env.mjs --client --api", { cwd: currentDir });

  // build packages
  console.log("Building packages... (this may take a few minutes)");
  execSync("pnpm run build", { cwd: currentDir });

  console.log(`

>> SnailyCADv4 was successfully updated.
>> follow these instructions to start SnailyCADv4: https://docs.snailycad.org/docs/installations/methods/autoinstaller#starting-snailycad
`);
}
