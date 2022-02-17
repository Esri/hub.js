import { getWithDefault } from "./objects/get-with-default";
import OperationError from "./OperationError";

/**
 * Generic Hub Error with an Error stack as well
 * as an optional serialized OperationStack.
 *
 * Also accepts a `rootCause` Error object
 */
export default class HubError extends OperationError {
  /**
   * Creates an instance of HubError.
   * @param {string} operation
   * @param {string} [message]
   * @param {Error} [rootCause]
   * @memberof HubError
   */
  constructor(operation: string, message?: string, rootCause?: Error) {
    message = message || "UNKNOWN_ERROR";
    // if the rootCause has a .rootCause, use that so we don't deeply nest
    rootCause = getWithDefault(rootCause, "rootCause", rootCause);
    /* Skip coverage on super(...) as per: 
       https://github.com/Microsoft/TypeScript/issues/13029
       https://github.com/SitePen/remap-istanbul/issues/106 
    */
    /* istanbul ignore next */
    super(operation, message, rootCause);
    this.name = "HubError";
    // if the original error has a stack use it, otherwise create a new
    // stack. Note: a new Stack will make it look like the error origninated
    // in the HubError constructor. This is only an issue in tests but
    // it can be confusing to debug
    this.stack = getWithDefault(rootCause, "stack", new Error().stack);
  }
}
