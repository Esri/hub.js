export async function _worker(queue: any[]) {
  while (queue.length > 0) {
    const request = queue.pop();
    await request();
  }
}
