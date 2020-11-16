# @himenon/exectime

Tool to measure execution time of CLI and JavaScript.
It supports both the browser and NodeJS environments.

## Install

```bash
yarn global add @himenon/exectime
```

## CLI

```ts
export EXECTIME_OUTPUT_PATH="performance.json"
export EXECTIME_NAME="my"

// Use environment settings
exectime -c "sleep 2"

// Use argument settings
exectime -n "sleepCommand" -o "exectime.json" -c "sleep 5"
```

### Show current settings

```bash
$ exectime -n "sleepCommand" -o "exectime.json" -c "sleep 5" --show-settings
output file path : exectime.json
name             : sleepCommand
command          : sleep 5
```

## API

```ts
import * as Exectime from "@himenon/exectime";

const wait = async ms => new Promise(resolve => setTimeout(resolve, ms));
const perfWait = Exectime.wrapAsync(wait, { name: "wait", label: "timer" });
await Promise.all([perfWait(1000), perfWait(500), perfWait(1200), perfWait(1300)]);
await Exectime.getResult();
```

## Development

| scripts                   | description                                 |
| :------------------------ | :------------------------------------------ |
| `build`                   | typescript build and create proxy directory |
| `clean`                   | clean up                                    |
| `format:code`             | prettier                                    |
| `format:yarn:lock`        | yarn.lock deduplicate                       |
| `lerna:version:up`        | lerna version up                            |
| `test`                    | execute test:depcruise, test:jest           |
| `test:depcruise`          | dependency-cruiser's test                   |
| `test:jest`               | jest test                                   |
| `ts`                      | execute ts-node                             |
| `release:github:registry` | publish GitHub registry                     |
| `release:npm:registry`    | publish npm registry                        |

## Features

- [Proxy Directory](https://himenon.github.io/docs/javascript/proxy-directory-design-pattern/)

## Release

- Automatic version updates are performed when merged into the `default` branch.

## LICENCE

[@himenon/exectime](https://github.com/Himenon/exectime-js)・MIT
