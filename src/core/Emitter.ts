import { PerformanceObserver, PerformanceEntry } from "perf_hooks";
import { EventEmitter } from "events";

interface State {
  list: PerformanceEntry[];
  executeQueue: string[];
}

export interface EventTable {
  "add:exec:queue": string;
  "remove:exec:queue": string;
  "perf:complete": PerformanceEntry[];
  "all:measure:finished": undefined;
}

class Emitter extends EventEmitter {
  private state: State = {
    list: [],
    executeQueue: [],
  };

  constructor() {
    super();
    this.handlerPerformanceMeasureComplete();
    this.initializeObserver();
    this.handlerExecuteQueue();
  }

  public on<K extends keyof EventTable>(event: K, listener: (payload: EventTable[K]) => void | Promise<void>): this {
    return super.on(event, listener);
  }

  public emit<K extends keyof EventTable>(event: K, payload?: EventTable[K]): boolean {
    return super.emit(event, payload);
  }

  private initializeObserver(): void {
    const observer = new PerformanceObserver(list => {
      this.emit("perf:complete", list.getEntries());
    });
    observer.observe({ entryTypes: ["measure"] });
  }

  private handlerExecuteQueue(): void {
    this.on("add:exec:queue", (uid: string) => {
      this.state.executeQueue.push(uid);
    });
    this.on("remove:exec:queue", (uid: string) => {
      this.state.executeQueue = this.state.executeQueue.filter(id => id !== uid);
    });
  }

  private handlerPerformanceMeasureComplete() {
    this.on("perf:complete", (list: PerformanceEntry[]) => {
      this.state.list = this.state.list.concat(list);
      if (this.state.executeQueue.length === 0) {
        this.emit("all:measure:finished");
      }
    });
  }

  public reset() {
    this.state.list = [];
  }

  public getResult(): Promise<PerformanceEntry[]> {
    return new Promise(resolve => {
      if (this.state.executeQueue.length === 0) {
        resolve(this.state.list);
        return;
      }
      this.on("all:measure:finished", () => {
        resolve(this.state.list);
      });
    });
  }
}

export const emitter = new Emitter();
