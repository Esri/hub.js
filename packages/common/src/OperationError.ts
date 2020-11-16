/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

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
    this.stack = new Error().stack;
  }
}
