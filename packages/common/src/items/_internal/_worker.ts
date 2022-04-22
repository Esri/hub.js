/**
 * Runs N Promises serially.
 *
 * @export
 * @param {any[]} queue Array of promises
 * @return {*}  {Promise<void>}
 */
export async function _worker(queue: any[]): Promise<void> {
  // While there is a queue
  while (queue.length > 0) {
    // remove the last item in the queue
    const request = queue.pop();
    // call it.
    await request();
  }
}
