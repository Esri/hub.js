import { IRequestOptions } from "@esri/arcgis-rest-request";
import OperationError from "../OperationError";
import OperationStack from "../OperationStack";
import { IHubRequestOptions } from "../types";

/**
 * Container type for Piping in Hub
 */
export interface IPipeable<Type> {
  data: Type;
  stack: OperationStack;
  requestOptions?: IHubRequestOptions | IRequestOptions;
}
/**
 * Signature of a function that can be used with createOperationPipeline
 */
export type PipelineFn<T> = (value: IPipeable<T>) => Promise<IPipeable<T>>;

/**
 * createOperationPipeline
 *
 * Returns a function that orchestrates a pipeline of smaller functions.
 *
 * All the functions must adhere to the `PipelineFn<T>` signature:
 *
 * `(value: IPipeable<T>) => Promise<IPipeable<T>>`
 *
 * Given an array of OperationPipeFns, run them in sequence and return the resultant promise
 *
 * i.e. `createOperationPipeline([fn1, fn2, f3])` will return in a function that chains
 * the functions like this: `fn1(input).then(fn2).then(fn3)).then(result)`
 *
 * @param fns functions to be run in sequence. Nested arrays are run in parallel
 * @returns Promise<Pipable<T>>
 */
export const createOperationPipeline =
  <T>(fns: Array<PipelineFn<T>>) =>
  (input: IPipeable<T>): Promise<IPipeable<T>> => {
    return fns.reduce((chain, func) => {
      return chain.then(func).catch((err) => {
        // if it's an OperationError we can just reject with it...
        if (err.name === "OperationError") {
          return Promise.reject(err);
        } else {
          // otherwise, create an OperationError and reject with that
          const msg = `IPipeableFn did not reject with an OperationError \n Operation Stack: \n ${input.stack.toString()}`;
          const opErr = new OperationError("pipeline execution error", msg);
          opErr.operationStack = input.stack.serialize();
          return Promise.reject(opErr);
        }
      });
    }, Promise.resolve(input));
  };
