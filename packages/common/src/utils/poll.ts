/**
 * Function to poll a provided request until a validation
 * state or timeout is reached
 * @param requestFn
 * @param validationFn
 * @param opts
 */
export const poll = async (
  requestFn: () => any,
  validationFn: (resp: any) => boolean,
  opts?: {
    timeout?: number;
    timeBetweenRequests?: number;
  }
): Promise<any> => {
  const options =
    opts || /* istanbul ignore next - must pass in overrides for tests */ {};
  const timeout = options.timeout || 30000;
  const timeBetweenRequests =
    options.timeBetweenRequests ||
    /* istanbul ignore next - cannot delay by this much in tests */ 3000;

  let resp: any;
  let requestCount = 0;

  do {
    // On subsequent requests, check if the configured
    // timeout has been reached
    // If YES: throw an error
    // If NO: delay before the next request
    if (requestCount > 0) {
      if (requestCount * timeBetweenRequests >= timeout) {
        throw new Error("Polling timeout");
      }
      await delay(timeBetweenRequests);
    }

    resp = await requestFn();
    requestCount++;
  } while (!validationFn(resp));

  return resp;
};

const delay = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
