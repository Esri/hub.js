import { IRequestOptions } from "../types";
import { apiRequest, authenticateRequest } from "./utils";

export function request(url: string, options: IRequestOptions) {
  return authenticateRequest(options).then(token => {
    return apiRequest(url, options, token);
  });
}
