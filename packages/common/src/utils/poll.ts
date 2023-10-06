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
  const { timeout = 30000, timeBetweenRequests = 3000 } = opts || {};
  let resp: any;
  let requestCount = 0;

  do {
    // on subsequent requests, check if the configured
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
