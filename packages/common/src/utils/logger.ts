
/**
 * Enum for Logger Levels
 */
export enum Level {
  all,
  debug,
  info,
  warn,
  error,
  off,
} 

/**
 * ```js
 * import { Logger, Level } from '@esri/hub-common'
 * ```
 * Functions share the console interface
 * ```js
 * Logger.log('My Message');
 * Logger.warn('Watch out!', { threat: 'Charizard' });
 * // etc, etc
 * ```
 * Available logging levels are specified in the Level enum. The hierarchy is as follows:
 * ```
 * off > error > warn > info > debug > all
 * ```
 * Logger only sends messages whose level is greater than or equal to the global log level
 * ```js
 * // Global level is 'warn'
 * Logger.info('This message won't log');
 * Logger.error('But this one will!');
 * ```
 * Logger's default level is 'off', so set desired level before use
 * ```js
 * Logger.setLogLevel(Level.all);
 * ```
 */
export class Logger {

  private static logLevel = Level.off;

  private static isLevelPermitted(level: Level) {
    return this.logLevel <= level;
  }

  /**
 * Sets the global log level 
 * @param {Level} level
 */
  public static setLogLevel(level: Level) {
    this.logLevel = level;
  }

  /**
 * Logs to debug if level is enabled
 * @param {string} message
 * @param {...*} objects additional objects to log (optional rest parameter)
 */
  public static log(message: string, ...objects: any[]) {
    if (this.isLevelPermitted(Level.debug)) {
      console.log(message, ...objects);
    }
  }

  /**
 * Logs to debug if level is enabled
 * @param {string} message
 * @param {...*} objects additional objects to log (optional rest parameter)
 */
  public static debug(message: string, ...objects: any[]) {
    if (this.isLevelPermitted(Level.debug)) {
      console.debug(message, ...objects);
    }
  }

  /**
 * Logs to info if level is enabled
 * @param {string} message
 * @param {...*} objects additional objects to log (optional rest parameter) 
 */
  public static info(message: string, ...objects: any[]) {
    if (this.isLevelPermitted(Level.info)) {
      console.info(message, ...objects);
    }
  }

  /**
 * Logs to warn if level is enabled
 * @param {string} message
 * @param {...*} objects additional objects to log (optional rest parameter) 
 */
  public static warn(message: string, ...objects: any[]) {
    if (this.isLevelPermitted(Level.warn)) {
      console.warn(message, ...objects);
    }
  }

  /**
 * Logs to error if level is enabled
 * @param {string} message
 * @param {...*} objects additional objects to log (optional rest parameter) 
 */
  public static error(message: string, ...objects: any[]) {
    if (this.isLevelPermitted(Level.error)) {
      console.error(message, ...objects);
    }
  }
}