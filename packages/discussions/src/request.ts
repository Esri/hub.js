import {
  // IChannelDTO, INestDeleteResult, INestPagination, IPostDTO, IReactionDTO,
  IRequestOptions
} from "./types";
import { apiRequest, authenticateRequest } from "./utils/request";

// NOTE: why doesn't this work??
// type ReturnTypes = Promise<
// IReactionDTO | IChannelDTO | IPostDTO |
// INestDeleteResult |
// INestPagination<IChannelDTO | IPostDTO>
// >

/**
 * method that authenticates and makes requests to Discussions API
 *
 * @export
 * @param {string} url
 * @param {IRequestOptions} options
 * @return {*}  {ReturnType}
 */
export function request(url: string, options: IRequestOptions): Promise<any> {
  return authenticateRequest(options).then(token => {
    return apiRequest(url, options, token);
  });
}
