/**
 * Generic structure for returning a translatable message from
 * one package to another, such that the calling package is responsible
 * for the translation
 *
 * @export
 * @interface ITranslatableMessage
 */
export interface ITranslatableMessage {
  /**
   * Unique key that can be used with a i18n system in a consuming application
   *
   * @type {string}
   * @memberof ITranslatableMessage
   */
  id: string;
  /**
   * English message describing the issue, for debugging only. Not intended to be shown
   * in an application interface.
   *
   * @type {string}
   * @memberof ITranslatableMessage
   */
  message: string;

  /**
   * Optional data that can be sent along
   *
   * @type {Record<string, unknown>}
   * @memberof ITranslatableMessage
   */
  data?: Record<string, unknown>;
}
