/**
 * @private
 */
export default class ExportCompletionError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ExportCompletionError.prototype);
  }
}
