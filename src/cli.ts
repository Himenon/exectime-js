import * as Ticktack from "./";
import execa from "execa";
import commander from "commander";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("../package.json");

export const shell = (command: string, cwd: string = process.cwd()): execa.ExecaChildProcess<string> => {
  console.log(command);
  return execa(command, {
    stdio: ["pipe", "pipe", "inherit"],
    shell: true,
    cwd,
  });
};

export interface CLIArguments {
  command: string;
  name: string;
}

const DEFAULT_NAME = "shell";

const validate = (args: commander.Command): CLIArguments => {
  if (typeof args["c"] !== "string") {
    throw new TypeError("Not string");
  }
  // cli arguments > ENV > DEFAULT_NAME
  const name = args["n"] === DEFAULT_NAME ? process.env.TICKTACK_NAME || DEFAULT_NAME : args["n"] || process.env.TICKTACK_NAME;
  if (!name || typeof name !== "string") {
    throw new TypeError("For '-n' or 'TICKTACK_NAME', specify a character string that is greater than or equal to the position character.");
  }
  return {
    command: args.c,
    name,
  };
};

const getCliArguments = (): CLIArguments => {
  commander
    .version(pkg.version)
    .option("-c [command]", "shell command")
    .option(
      "-n [name]",
      "For performance recording. It can also be specified by the environment variable `export TICKTACK_NAME='perf'`",
      DEFAULT_NAME,
    )
    .parse(process.argv);
  return validate(commander);
};

const main = async () => {
  const args = getCliArguments();
  const sh = Ticktack.wrapAsync(shell, { name: args.name });
  await sh(args.command);
  console.log(await Ticktack.getResult());
};

main().catch(error => {
  console.error(`Failed: ${error.message}`);
  process.exit(1);
});
