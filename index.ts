import { Command } from "commander";
import FS from "fs";
import { configure, render } from "nunjucks";
import Process from "process";
import Package from "./package.json";

function main() {
  configure("template", { autoescape: true });

  const program = new Command();

  program
    .name(Package.name)
    .description(Package.description)
    .version(Package.version);

  program
    .command("frontend [path]")
    .option("--webpack-proxy", "Enable proxy for local development.", false)
    .description("Generate frontend template files from environment.")
    .action((path, options) => {
      const { env } = Process;

      const keys = Object.keys(env);

      const keysFiltered = keys.filter((k) => k.includes("PROXY_"));

      let variables: { [key: string]: string | undefined } = {};

      for (const key of keysFiltered) {
        variables[`${key.replace("PROXY_", "")}`] = env[key];
      }

      const outputDefault = render("default.conf.j2", {
        webpackProxy: options["webpackProxy"],
      });

      const outputEnv = render("env.js.j2", { variables });

      const pathApp = path || "/usr/src/app";
      const pathNginx = path || "/etc/nginx";

      try {
        FS.writeFileSync(`${pathApp}/env.js`, outputEnv);
        FS.writeFileSync(`${pathNginx}/conf.d/default.conf`, outputDefault);

        console.log("Successfully generated frontend template files.");
      } catch (err) {
        console.error(err);
      }
    });

  program.parse();
}

main();
