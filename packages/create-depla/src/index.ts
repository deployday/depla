#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";

async function main() {
  console.log(chalk.cyan("🌱 Welcome to create-depla!"));

  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter project name:",
      default: "my-depla-app"
    }
  ]);

  console.log(chalk.green(`Scaffolding project: ${projectName}`));
}

main();

