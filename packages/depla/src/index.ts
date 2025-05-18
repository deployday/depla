import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, "../templates");

export async function scaffoldProject() {
  console.log(chalk.cyan(" welcome to create-depla!"));

  const { projectName, template } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter project name:",
      default: "my-depla-app",
    },
    {
      type: "list",
      name: "template",
      message: "Select a template:",
      choices: fs.readdirSync(TEMPLATES_DIR),
    },
  ]);

  const targetDir = path.resolve(process.cwd(), projectName);
  const templateDir = path.resolve(TEMPLATES_DIR, template);

  console.log(chalk.gray(`→ Copying from ${templateDir}`));
  console.log(chalk.gray(`→ Creating in ${targetDir}`));

  try {
    await fs.copy(templateDir, targetDir);
    console.log(chalk.green("✔ Project scaffolded successfully!"));
  } catch (err) {
    console.error(chalk.red("❌ Failed to scaffold project:"), err);
  }
}
