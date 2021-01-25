/**
 * @private
 */
export default class ExportCompletionError extends Error {
  constructor(message: string) {
    /* istanbul ignore next */
    super(message);
    Object.setPrototypeOf(this, ExportCompletionError.prototype);
  }
}
