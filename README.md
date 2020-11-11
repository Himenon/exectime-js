# @himenon/ticktack

Tool to measure execution time of CLI and JavaScript.

## Usage

Install

```bash
yarn add -D @himenon/ticktack
```

### CLI

```ts
export TICKTACK_OUTPUT_PATH="performance.json"z

ticktack --label "build" --tag "yarn" --command "yarn run build"
```

### API

```ts
import * as Ticktack from "@himenon/ticktack";

const wait = async ms => new Promise(resolve => setTimeout(resolve, ms));

const wrappedWait = Ticktack.wrap(wait, { label: "wait", tag: "default" });

const main = async () => {
  await wrappedWait(5000);
  await Ticktack.exec(() => wait(), { label: "wait", tag: "perf" });

  Ticktack.getResult(); // default all
  Ticktack.getResult({
    label: (label: string) => ["wait", "hoge"].includes(label),
    tag: (tag: string) => ["wait", "hoge"].includes(tag),
  });
};

main().catch(console.error);
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
| `release:github:registry` | publish github registry                     |
| `release:npm:registry`    | publish npm registry                        |

## Features

- [Proxy Directory](https://himenon.github.io/docs/javascript/proxy-directory-design-pattern/)

## Release

- Automatic version updates are performed when merged into the `default` branch.

## LICENCE

[@himenon/ticktack](https://github.com/Himenon/ticktack-js)・MIT
