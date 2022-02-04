import process from "node:process";
import { execSync } from "node:child_process";
import { isCADDirectory } from "./utils/isCADDirectory";
import { gitPull } from "./utils/gitPull";
import inquirer from "inquirer";
import { resolve } from "node:path";

export const __IS_DEV__ = process.env.NODE_ENV === "development";

// eslint-disable-next-line promise/catch-or-return
main().then(() => process.exit(0));

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
  execSync("yarn", { cwd: currentDir });

  // copy .env file to client & api
  execSync("node scripts/copy-env.mjs --client --api", { cwd: currentDir });

  // build packages
  console.log("Building packages... (this may take a few minutes)");
  execSync("yarn turbo run build", { cwd: currentDir });

  console.log(`

>> SnailyCADv4 was successfully updated.
>> follow these instructions to start SnailyCADv4: https://cad-docs.netlify.app/install/methods/standalone#starting-snailycadv4
`);
}
