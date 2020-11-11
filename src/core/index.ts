/* eslint-disable @typescript-eslint/no-explicit-any */
import { PerformanceObserver } from "perf_hooks";

export type Func = <T extends (...optionalParams: any[]) => any>(fn: T) => T;

export type AsyncFunc = (...args: any[]) => Promise<any>;

export const createPerformanceObserver = () => {
  return new PerformanceObserver(list => {
    console.log("完了");
    console.log(list.getEntries());
  });
};
