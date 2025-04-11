type LogType = "info" | "warn" | "error" | "debug" | "verbose";

export class Logger {
  private allowedLogLevels: LogType[];
  private TAG = "EasyLeap";
  constructor(allowedLogLevels: LogType[] = ["info", "warn", "error"]) {
    this.allowedLogLevels = allowedLogLevels;
  }

  info(message: string, ...args: any[]) {
    if (!this.allowedLogLevels.includes("info")) return;
    console.log(`${this.TAG} INFO: ${message}`, ...args);
  }

  warn(message: string, ...args: any[]) {
    if (!this.allowedLogLevels.includes("warn")) return;
    console.warn(`${this.TAG} WARN: ${message}`, ...args);
  }

  error(message: string, ...args: any[]) {
    if (!this.allowedLogLevels.includes("error")) return;
    console.error(`${this.TAG} ERROR: ${message}`, ...args);
  }

  debug(message: string, ...args: any[]) {
    if (!this.allowedLogLevels.includes("debug")) return;
    console.debug(`${this.TAG} DEBUG: ${message}`, ...args);
  }

  verbose(message: string, ...args: any[]) {
    if (!this.allowedLogLevels.includes("verbose")) return;
    console.log(`${this.TAG} VERBOSE: ${message}`, ...args);
  }
}

export const logger = new Logger(["info", "warn", "error", "debug", "verbose"]);