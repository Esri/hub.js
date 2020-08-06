import { IHubRequestOptions } from "./index";

/**
 * remote server error
 */
export class RemoteServerError extends Error {
  status: number;
  url: string;

  constructor(message: string, url: string, status: number) {
    // Istanbul erroneously treats extended class constructors as an uncovered branch: https://github.com/gotwarlost/istanbul/issues/690
    /* istanbul ignore next */
    super(message);
    this.status = status;
    this.url = url;
  }
}

/**
 * make a request to the Hub API
 * @param url URL to request
 * @param requestOptions request options
 */
export function hubRequest(url: string, requestOptions?: IHubRequestOptions) {
  // TODO: use request() under the hood?
  // requestOptions.params.f = null;
  // return request(url, requestOptions);
  // TODO: cast to JSONAPI document?
  // .then(response => {
  //   const { data, meta } = response;
  //   return { data, meta } as Document;
  // });
  // TODO: base on requestOptions
  const fetchFn = /* requestOptions.fetch || */ fetch;
  return fetchFn(url, {
    method: "POST", // TODO: get from requestOptions?
    headers: {
      // TODO: base on request requestOptions?
      "Content-Type": "application/json"
    }
    // TODO: base on requestOptions.params?
    // body: JSON.stringify(body)
  }).then(resp => {
    if (resp.ok) {
      return resp.json();
    } else {
      throw new RemoteServerError(resp.statusText, url, resp.status);
    }
  });
}
