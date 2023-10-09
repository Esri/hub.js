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
export const poll = async (
  requestFn: () => any,
  validationFn: (resp: any) => boolean,
  opts?: {
    timeout?: number;
    timeBetweenRequests?: number;
  }
): Promise<any> => {
  const options =
    opts || /* istanbul ignore next - we must pass in overrides for tests */ {};
  const timeout = isNaN(options.timeout) ? 30000 : options.timeout;
  /* istanbul ignore next - should not cover the 3000 case in tests */
  const timeBetweenRequests = isNaN(options.timeBetweenRequests)
    ? 3000
    : options.timeBetweenRequests;

  let resp: any;
  let requestCount = 0;
  let timeElapsed = 0;

  do {
    // On subsequent requests, check if the timeout has been reached
    // If YES: throw an error
    // If NO: delay before the next request
    if (requestCount > 0) {
      timeElapsed += requestCount * timeBetweenRequests;
      if (timeElapsed >= timeout) {
        throw new Error("Polling timeout");
      }

      // NOTE: we incrementally increase the time between requests
      // so as not to hammer an API with subsequent calls.
      // This was specifically requested by the Portal API team
      await delay(requestCount * timeBetweenRequests);
    }

    resp = await requestFn();
    requestCount++;
  } while (!validationFn(resp));

  return resp;
};

const delay = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
