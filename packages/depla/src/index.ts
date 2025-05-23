import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import degit from "degit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, "../templates");

function replaceVariables(content: string, variables: Record<string, string>): string {
  return content.replace(/{{(\w+)}}/g, (_, key) => variables[key] ?? "");
}

async function copyAndReplace(templateDir: string, targetDir: string, vars: Record<string, string>) {
  const files = await fs.readdir(templateDir);

  for (const file of files) {
    const src = path.join(templateDir, file);
    const dest = path.join(targetDir, file);
    const stat = await fs.stat(src);

    if (stat.isDirectory()) {
      await fs.mkdirp(dest);
      await copyAndReplace(src, dest, vars);
    } else {
      const content = await fs.readFile(src, "utf8");
      const replaced = replaceVariables(content, vars);
      await fs.outputFile(dest, replaced);
    }
  }
}

export async function downloadTemplateFromGitHub(repo: string, targetDir: string) {
  const emitter = degit(repo, {
    cache: false,
    force: true,
    verbose: true,
  });

  await emitter.clone(targetDir);
}


export async function scaffoldProject({
  template,
  targetDir,
  variables,
}: {
  template: string;
  targetDir: string;
  variables: Record<string, string>;
}) {
  const isRemote = /^([\w-]+\/[\w.-]+)(#.*)?$/.test(template); // e.g. user/repo or user/repo#branch

  const templateDir = path.resolve(".depla-temp-template");

  if (isRemote) {
    console.log(`📥 Downloading remote template from ${template}...`);
    await downloadTemplateFromGitHub(template, templateDir);
  } else {
    const localPath = path.resolve(__dirname, "../templates", template);
    if (!fs.existsSync(localPath)) throw new Error(`Template ${template} not found`);
    await fs.copy(localPath, templateDir);
  }

  await copyAndReplace(templateDir, targetDir, variables);
  await fs.remove(templateDir); // clean up temp
}

