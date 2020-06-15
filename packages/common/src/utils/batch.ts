import {
  IBatch,
  IBatchTransform
} from "../types";

/**
 * Helper to split a large number of calls into
 * smaller batches of concurrent calls.
 * @param {Array} values Any array of values with which to invoke fn
 * @param {Function} fn The function that will be invoked with each value
 * @param {number} [batchSize=5] The number of concurrent calls to fn, defaults to 5
 * @returns {Promise<IBatch[]>}
 */
export function batch (
  values: IBatch,
  fn: IBatchTransform,
  batchSize: number = 5
): Promise<any> {
  const toBatches = (
    batches: IBatch[],
    value: any
  ): IBatch[] => {
    let batch = batches[batches.length - 1];
    if (!batch || batch.length === batchSize) {
      batch = [];
      batches.push(batch);
    }
    batch.push(value);
    return batches;
  };

  const toSerialBatchChain = (
    promise: Promise<any>,
    batchOfValues: IBatch
  ): Promise<any> => {
    const executeBatch = () => {
      const batchResults = batchOfValues.map(id => fn(id));
      return Promise.all(batchResults);
    };
    return promise.then(executeBatch);
  };

  // split values into batches of values
  const batches = values.reduce(toBatches, []);

  // batches are processed serially, however
  // all calls within a batch are concurrent
  return batches.reduce(
    toSerialBatchChain,
    Promise.resolve()
  );
};
