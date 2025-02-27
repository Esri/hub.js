import { LogLevel } from "./LogLevel";

/**
 * Hub.js configuration settings
 *
 * You can override the default settings by
 * initializing the global `arcgisHubConfig` variable
 * before using any Hub.js functions, for example:
 * ```js
 * import { Logger } from '@esri/hub-common';
 * // configure Hub.js
 * const logLevel = environment === 'production' ? 'error' : 'debug';
 * globalThis.arcgisHubConfig = { logLevel };
 * // then use Hub.js
 * Logger.info('This message will not log on production');
 * ```
 */
export interface IHubConfig {
  /**
   * The global log level for Hub.js
   *
   * Available logging levels are specified in the LogLevel type. The default is 'info'.
   */
  logLevel?: LogLevel;
}
