# @himenon/ticktack

Tool to measure execution time of CLI and JavaScript.
It supports both the browser and NodeJS environments.

## Install

```bash
yarn global add @himenon/ticktack
```

## CLI

```ts
export TICKTACK_OUTPUT_PATH="performance.json"
export TICKTACK_NAME="my"

// Use environment settings
ticktack -c "sleep 2"

// Use argument settings
ticktack -n "sleepCommand" -o "ticktack.json" -c "sleep 5"
```

### Show current settings

```bash
$ ticktack -n "sleepCommand" -o "ticktack.json" -c "sleep 5" --show-log info,command  --show-settings
output file path : ticktack.json
name             : sleepCommand
command          : sleep 5
Show message type: info, command
```

## API

```ts
import * as Ticktack from "@himenon/ticktack";

const wait = async ms => new Promise(resolve => setTimeout(resolve, ms));
const perfWait = Ticktack.wrapAsync(wait, { name: "wait", label: "timer" });
await Promise.all([perfWait(1000), perfWait(500), perfWait(1200), perfWait(1300)]);
await Ticktack.getResult();
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

[@himenon/ticktack](https://github.com/Himenon/ticktack-js)・MIT
