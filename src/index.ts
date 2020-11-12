import { performance } from "perf_hooks";
import { emitter, PerformanceData, PerformanceMeasurementResult, convert, PerformanceObserver, PerformanceEntry } from "./core";
import { v4 as generateUniqueId } from "uuid";

export { PerformanceData, PerformanceMeasurementResult, convert, PerformanceObserver, PerformanceEntry };

export interface WrapOption {
  name: string;
}

/**
 * 同期関数のWrapper
 *
 * @param fn
 * @param option
 */
export const wrapSync = <T extends unknown[], K>(fn: (...args: T) => K, option: WrapOption): ((...args: T) => K) => {
  const start = `start-${option.name}`;
  const stop = `stop-${option.name}`;
  const wrapFunc = (...args: T): K => {
    const uid = generateUniqueId();
    emitter.emit("add:exec:queue", uid);
    performance.mark(start);
    const returnValue = fn(...args);
    performance.mark(stop);
    performance.measure(option.name, start, stop);
    emitter.emit("remove:exec:queue", uid);
    return returnValue;
  };
  return wrapFunc;
};

type GetPromiseValue<T> = T extends Promise<infer U> ? U : never;

/**
 * 非同期関数のWrapper
 *
 * @param fn
 * @param option
 */
export const wrapAsync = <T extends unknown[], U extends Promise<unknown>, K extends GetPromiseValue<U>>(
  fn: (...args: T) => Promise<K>,
  option: WrapOption,
): ((...args: T) => Promise<K>) => {
  const start = `start-${option.name}`;
  const stop = `stop-${option.name}`;
  const wrapFunc = async (...args: T): Promise<K> => {
    const uid = generateUniqueId();
    emitter.emit("add:exec:queue", uid);
    performance.mark(start);
    const returnValue = await fn(...args);
    performance.mark(stop);
    performance.measure(option.name, start, stop);
    emitter.emit("remove:exec:queue", uid);
    return returnValue;
  };
  return wrapFunc;
};

export const getResult = emitter.getResult.bind(emitter);
