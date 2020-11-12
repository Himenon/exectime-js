import * as Ticktack from "./";
import * as fs from "fs";
import execa from "execa";
import commander from "commander";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("../package.json");
const version = pkg.version as string;
const now = new Date();

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
  output: string;
}

const DEFAULT_NAME = "shell";
const DEFAULT_OUTPUT_PATH = "ticktack.json";

const validate = (args: commander.Command): CLIArguments => {
  if (typeof args["c"] !== "string") {
    throw new TypeError("Not string");
  }
  // cli arguments > ENV > DEFAULT_NAME
  const name = args["n"] === DEFAULT_NAME ? process.env.TICKTACK_NAME || DEFAULT_NAME : args["n"] || process.env.TICKTACK_NAME;
  if (!name || typeof name !== "string") {
    throw new TypeError("For '-n' or 'TICKTACK_NAME', specify a character string that is greater than or equal to the position character.");
  }
  const output =
    args["o"] === DEFAULT_OUTPUT_PATH ? process.env.TICKTACK_OUTPUT_PATH || DEFAULT_OUTPUT_PATH : args["o"] || process.env.TICKTACK_OUTPUT_PATH;
  if (!name || typeof name !== "string") {
    throw new TypeError(
      "For '-o' or 'TICKTACK_OUTPUT_PATH', specify a character string that is greater than or equal to the position character.",
    );
  }
  return {
    command: args.c,
    name,
    output,
  };
};

const getCliArguments = (): CLIArguments => {
  commander
    .version(version)
    .option("-c [command]", "shell command")
    .option(
      "-n [name]",
      "For performance recording. It can also be specified by the environment variable `export TICKTACK_NAME='shell'`",
      DEFAULT_NAME,
    )
    .option(
      "-o [output path]",
      "Output json file path. It can also be specified by the environment variable `export TICKTACK_OUTPUT_PATH='ticktack.json'",
      DEFAULT_OUTPUT_PATH,
    )
    .parse(process.argv);
  return validate(commander);
};

/**
 * - すでにファイルが存在する場合は上書きする
 * - ファイルが存在しない場合は作成する
 */
const createOrOverride = (filename: string, outputData: Ticktack.PerformanceMeasurementResult): void => {
  try {
    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, JSON.stringify(outputData, null, 2), { encoding: "utf-8" });
      return;
    }
    const rawText = fs.readFileSync(filename, { encoding: "utf-8" });
    const restoreData: Ticktack.PerformanceMeasurementResult = JSON.parse(rawText);

    restoreData.meta.version = outputData.meta.version;
    restoreData.meta.updatedAt = outputData.meta.updatedAt;
    restoreData.data = restoreData.data.concat(outputData.data);

    fs.writeFileSync(filename, JSON.stringify(restoreData, null, 2), { encoding: "utf-8" });

    console.log(`\nOutput: ${filename}`);
  } catch (error) {
    throw new Error(error);
  }
};

const main = async () => {
  const args = getCliArguments();
  await Ticktack.wrapAsync(shell, { name: args.name })(args.command);
  const data = (await Ticktack.getResult()).map(entry => Ticktack.convert(now.getTime(), entry));
  const result: Ticktack.PerformanceMeasurementResult = {
    meta: {
      version,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    data,
  };
  createOrOverride(args.output, result);
};

main().catch(error => {
  console.error(`Failed: ${error.message}`);
  process.exit(1);
});
