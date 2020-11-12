import { emitter, PerformanceObserver, PerformanceEntry } from "./Emitter";

export { emitter, PerformanceObserver, PerformanceEntry };

export interface PerformanceData {
  name: string;
  durationMs: number;
  startDateUnixTimeMs: number;
  timestampExecStartTimeMs: number;
}

export interface PerformanceMeasurementResult {
  meta: {
    version: string;
    createdAt: string;
    updatedAt: string;
  };
  data: PerformanceData[];
}

export const convert = (startDateUnixTimeMs: number, entry: PerformanceEntry): PerformanceData => {
  return {
    name: entry.name,
    startDateUnixTimeMs: startDateUnixTimeMs,
    timestampExecStartTimeMs: entry.startTime,
    durationMs: entry.duration,
  };
};
