import { _worker } from "./_worker";

export async function _multiThreadUpload(queue: any[], concurrency: number) {
  try {
    const execution = [];

    for (let i = 0; i < concurrency; i++) {
      execution.push(_worker(queue));
    }

    await Promise.all(execution);
  } catch (error) {
    // clear all upcoming requests if there is any error.
    queue.length = 0;
    throw error;
  }
}
