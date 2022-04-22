import { _worker } from "./_worker";

/**
 * Sets up N threads for requests to be run concurrently.
 * _worker will run each thread serially.
 *
 * @export
 * @param {any[]} queue Array of requests
 * @param {number} concurrency How many threads will be run?
 * @return {*}  {Promise<void>}
 */
export async function _multiThreadUpload(
  queue: any[],
  concurrency: number
): Promise<void> {
  try {
    const execution = [];
    // Set up 'threads'
    for (let i = 0; i < concurrency; i++) {
      // Add each 'thread' to execution
      execution.push(_worker(queue));
    }
    // Execute 'threads'
    await Promise.all(execution);
  } catch (error) {
    // clear all upcoming requests if there is any error.
    queue.length = 0;
    throw error;
  }
}
