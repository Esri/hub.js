import { getQueryParams } from './get-query-params';

export class Logger {

  private static _isDebugEnabled(winRef: Window) {
    const debugParam = getQueryParams(winRef).debug;
    return debugParam == true || debugParam === 'true';
  }

  /**
 * Logs to console log level if url debug param is truthy (true, 1)
 * @param {string} message
 * @param {...*} objects additional objects to log (optional rest parameter)
 */
  public static log(winRef: Window, message: string, ...objects: any[]) {
    if (this._isDebugEnabled(winRef)) {
      console.log(message, ...objects);
    }
  }

  /**
 * Logs to console info level if url debug param is truthy (true, 1)
 * @param {string} message
 * @param {...*} objects additional objects to log (optional rest parameter) 
 */
  public static info(winRef: Window, message: string, ...objects: any[]) {
    if (this._isDebugEnabled(winRef)) {
      console.info(message, ...objects);
    }
  }

  /**
 * Logs to console warn level if url debug param is truthy (true, 1)
 * @param {string} message
 * @param {...*} objects additional objects to log (optional rest parameter) 
 */
  public static warn(winRef: Window, message: string, ...objects: any[]) {
    if (this._isDebugEnabled(winRef)) {
      console.warn(message, ...objects);
    }
  }

  /**
 * Logs to console error level if url debug param is truthy (true, 1)
 * @param {string} message
 * @param {...*} objects additional objects to log (optional rest parameter) 
 */
  public static error(winRef: Window, message: string, ...objects: any[]) {
    if (this._isDebugEnabled(winRef)) {
      console.error(message, ...objects);
    }
  }
}