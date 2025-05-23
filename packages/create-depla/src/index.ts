import { scaffoldProject } from "@depla/depla";
import { Command } from "commander";

const program = new Command();

program
  .name("create-depla")
  .option("-t, --template <template>", "template to use (e.g. basic or user/repo)")
  .option("-n, --name <name>", "project name")
  .parse(process.argv);

const opts = program.opts();

await scaffoldProject({
  template: opts.template || "basic",
  targetDir: opts.name || "my-depla-app",
  variables: {
    projectName: opts.name || "my-depla-app",
    author: process.env.USER || "anonymous",
  },
});