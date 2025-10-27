/* tslint:disable no-console */
import { logLevel } from "./internal/config";

/**
 * Enum for Logger Levels
 */
const LEVEL = {
  all: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  off: 5,
} as const;

type Level = (typeof LEVEL)[keyof typeof LEVEL];

/**
 * ```js
 * import { Logger } from '@esri/hub-common'
 * ```
 * Functions share the console interface
 * ```js
 * Logger.log('My Message');
 * Logger.warn('Watch out!', { threat: 'Charizard' });
 * // etc, etc
 * ```
 * Available logging levels are specified in the LogLevel type. The hierarchy is as follows:
 * ```
 * off > error > warn > info > debug > all
 * ```
 * Logger only sends messages whose level is greater than or equal to the global log level
 * ```js
 * // Global level is 'warn'
 * Logger.info('This message won't log');
 * Logger.error('But this one will!');
 * ```
 */
export class Logger {
  /**
   * Logs to debug if level is enabled
   * @param {string} message
   * @param {...*} objects additional objects to log (optional rest parameter)
   */
  public static log(message: string, ...objects: any[]) {
    if (this.isLevelPermitted(LEVEL.debug)) {
      console.log(message, ...objects);
    }
  }

  /**
   * Logs to debug if level is enabled
   * @param {string} message
   * @param {...*} objects additional objects to log (optional rest parameter)
   */
  public static debug(message: string, ...objects: any[]) {
    if (this.isLevelPermitted(LEVEL.debug)) {
      console.debug(message, ...objects);
    }
  }

  /**
   * Logs to info if level is enabled
   * @param {string} message
   * @param {...*} objects additional objects to log (optional rest parameter)
   */
  public static info(message: string, ...objects: any[]) {
    if (this.isLevelPermitted(LEVEL.info)) {
      console.info(message, ...objects);
    }
  }

  /**
   * Logs to warn if level is enabled
   * @param {string} message
   * @param {...*} objects additional objects to log (optional rest parameter)
   */
  public static warn(message: string, ...objects: any[]) {
    if (this.isLevelPermitted(LEVEL.warn)) {
      console.warn(message, ...objects);
    }
  }

  /**
   * Logs to error if level is enabled
   * @param {string} message
   * @param {...*} objects additional objects to log (optional rest parameter)
   */
  public static error(message: string, ...objects: any[]) {
    if (this.isLevelPermitted(LEVEL.error)) {
      console.error(message, ...objects);
    }
  }

  private static isLevelPermitted(level: Level) {
    const configuredLevel = LEVEL[logLevel];
    return configuredLevel <= level;
  }
}
