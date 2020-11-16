import { EOL } from "os";
import * as Exectime from "./";
import * as fs from "fs";
import execa from "execa";
import commander from "commander";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("../package.json");
const version = pkg.version as string;
const now = new Date();

type MessageType = "json" | "info" | "command" | "force" | "settings";
const MESSAGE_TYPE: MessageType[] = ["json", "info", "command", "force", "settings"];
let messageTypes: MessageType[] = [];

const showMessage = (message: string, messageType: MessageType) => {
  const canShowMessage = message !== "" && messageTypes.includes(messageType);
  if (canShowMessage || messageType === "force") {
    process.stdout.write(message + EOL);
  }
};

export const shell = (command: string, cwd: string = process.cwd()): execa.ExecaChildProcess<string> => {
  showMessage(command, "command");
  return execa(command, {
    stdio: ["pipe", "pipe", "inherit"],
    shell: true,
    cwd,
  });
};

export interface CLIArguments {
  command: string;
  name: string;
  output: string | undefined;
  isShowSettings: boolean;
}

const DEFAULT_NAME = "shell";
const ENV_EXECTIME_NAME = process.env.EXECTIME_NAME;
const ENV_EXECTIME_OUTPUT_PATH = process.env.EXECTIME_OUTPUT_PATH;

const isMessageType = (value: any): value is MessageType => {
  return MESSAGE_TYPE.includes(value);
};

const validate = (args: commander.Command): CLIArguments => {
  if (typeof args["c"] !== "string") {
    throw new TypeError("Not string");
  }
  // cli arguments > ENV > DEFAULT_NAME
  const name = args["n"] === DEFAULT_NAME ? ENV_EXECTIME_NAME || DEFAULT_NAME : args["n"] || ENV_EXECTIME_NAME;
  if (!name || typeof name !== "string") {
    throw new TypeError("For '-n' or 'EXECTIME_NAME', specify a character string that is greater than or equal to the position character.");
  }
  const showLogPattern = typeof args["show"] === "string" ? args["show"] : "";
  messageTypes = showLogPattern.split(",").filter(isMessageType);
  return {
    command: args.c,
    name,
    output: ENV_EXECTIME_OUTPUT_PATH || args["o"],
    isShowSettings: messageTypes.includes("settings"),
  };
};

const getCliArguments = (): CLIArguments => {
  commander
    .version(version)
    .option("-c [command]", "shell command")
    .option(
      "-n [name]",
      "For performance recording. It can also be specified by the environment variable `export EXECTIME_NAME='shell'`",
      DEFAULT_NAME,
    )
    .option(
      "-o [output path]",
      "Output json file path. It can also be specified by the environment variable `export EXECTIME_OUTPUT_PATH='exectime.json'",
    )
    .option("--show [string]", "Comma separated string. [command|data|info|json|settings]")
    .parse(process.argv);
  return validate(commander);
};

/**
 * - すでにファイルが存在する場合は上書きする
 * - ファイルが存在しない場合は作成する
 */
const createOrOverride = (filename: string, outputData: Exectime.PerformanceMeasurementResult): void => {
  try {
    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, JSON.stringify(outputData, null, 2), { encoding: "utf-8" });
      showMessage(`Create File: "${filename}".`, "info");
      return;
    }
    const rawText = fs.readFileSync(filename, { encoding: "utf-8" });
    const restoreData: Exectime.PerformanceMeasurementResult = JSON.parse(rawText);

    restoreData.meta.version = outputData.meta.version;
    restoreData.meta.updatedAt = outputData.meta.updatedAt;
    restoreData.data = restoreData.data.concat(outputData.data);

    fs.writeFileSync(filename, JSON.stringify(restoreData, null, 2), { encoding: "utf-8" });
    showMessage(`Update file "${filename}".`, "info");
  } catch (error) {
    throw new Error(error);
  }
};

const showSetting = (args: CLIArguments) => {
  const result = [
    `Output file path : ${args.output || ""}`,
    `Name             : ${args.name}`,
    `Command          : ${args.command}`,
    `Show message type: ${messageTypes.join(", ")}`,
  ].join(EOL);
  showMessage(result, "force");
};

const main = async () => {
  const args = getCliArguments();
  if (args.isShowSettings) {
    showSetting(args);
    return;
  }
  const sh = Exectime.wrapAsync(shell, { name: args.name });
  const { stdout: message } = await sh(args.command);
  showMessage(message, "command");
  const data = (await Exectime.getResult()).map(entry => Exectime.convert(now.getTime(), entry));
  const result: Exectime.PerformanceMeasurementResult = {
    meta: {
      version,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    data,
  };
  if (args.output) {
    createOrOverride(args.output, result);
  } else {
    showMessage(JSON.stringify(result, null, 2), "json");
  }
};

main().catch(error => {
  console.error(`Failed: ${error.message}`);
  process.exit(1);
});
