import { createPerformanceObserver } from "./core";
import { performance } from "perf_hooks";

export interface WrapOption {
  name?: string;
}

const obs = createPerformanceObserver();
obs.observe({ entryTypes: ["measure"], buffered: true });

export const wrapSync = <T extends (...args: any[]) => any>(fn: T): T => {
  const wrappedFunc = performance.timerify(fn);
  // @see https://stackoverflow.com/questions/38598280/is-it-possible-to-wrap-a-function-and-retain-its-types
  return wrappedFunc;
};

export type GetPromiseValue<T> = T extends Promise<infer U> ? U : never;

/**
 * 非同期関数のwrapper
 * @param fn
 */
export const wrapAsync = <T extends any[], U extends Promise<any>, K extends GetPromiseValue<U>>(
  fn: (...args: T) => Promise<K>,
): ((...args: T) => Promise<K>) => {
  const wrapFunc = async (...args: T): Promise<K> => {
    performance.mark("A");
    const result = await fn(...args);
    performance.mark("B");
    performance.measure("sample", "A", "B");
    console.log("end");
    return result;
  };
  return wrapFunc;
};

export const stop = () => {
  obs.disconnect();
};
