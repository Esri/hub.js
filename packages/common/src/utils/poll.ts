/**
 * Function to poll a provided request until a validation
 * state or timeout is reached
 *
 * NOTE: we expose this as a public util, but should use this
 * functionality sparingly when dealing with the Portal API.
 * Best practice is to leverage this polling functionality
 * internally on functions that we know incur a Portal delay.
 *
 * @param requestFn
 * @param validationFn
 * @param opts
 */
export async function poll<T>(
  requestFn: () => Promise<T>,
  validationFn: (resp: T) => boolean,
  options?: {
    maxAttempts?: number;
    initialRetryDelay?: number;
  }
): Promise<T> {
  const isGreaterThanZero = (num: number) => !isNaN(num) && num > 0;
  const _maxAttempts = isGreaterThanZero(options?.maxAttempts)
    ? options.maxAttempts
    : 7;
  const _delay = isGreaterThanZero(options?.initialRetryDelay)
    ? options.initialRetryDelay
    : 500;
  async function pollRecursive(attempt: number, delay: number): Promise<T> {
    if (attempt > _maxAttempts) {
      throw new Error(`Polling failed after ${_maxAttempts} attempts`);
    }
    const results = await new Promise<T>((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      setTimeout(async () => {
        const res = await requestFn();
        resolve(res);
      }, delay);
    });
    return validationFn(results)
      ? results
      : await pollRecursive(attempt + 1, attempt === 1 ? _delay : delay * 2);
  }
  return pollRecursive(1, 0);
}
