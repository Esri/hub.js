/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getWithDefault } from "./objects/get-with-default";
import { ISerializedOperationStack } from "./types";

/**
 * Generic Solution Error with an Error stack as well
 * as an optional serialized OperationStack.
 *
 * Also accepts a `rootCause` Error object
 */
export default class OperationError extends Error {
  /**
   * Stack trace
   *
   * @type {string}
   * @memberof OperationError
   */
  public stack: string;
  /**
   * What operation failed
   *
   * @type {string}
   * @memberof OperationError
   */
  public operation: string;
  /**
   * Root Error that was thrown
   *
   * @type {Error}
   * @memberof OperationError
   */
  public rootCause?: Error;

  public operationStack?: ISerializedOperationStack;
  /**
   * Creates an instance of OperationError.
   * @param {string} operation
   * @param {string} [message]
   * @param {Error} [rootCause]
   * @memberof OperationError
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
    super(message);
    this.operation = operation;
    this.name = "OperationError";
    this.rootCause = rootCause;
    Object.setPrototypeOf(this, OperationError.prototype);
    // using rootCause.stack ensures that the resulting error will have the original
    // message + call stack. If that's not an option, we create a new
    // stack... which is better than nothing, but it will look like
    // OperationError is the source of the error
    this.stack = getWithDefault(rootCause, "stack", new Error().stack);
  }
}
