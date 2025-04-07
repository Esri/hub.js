import { discussionsApiRequestV2 } from "../discussions-api-request";
import {
  ICreateReactionOptions,
  IRemoveReactionOptions,
  IRemoveReactionResponse,
  IReaction,
} from "../types";

/*******************************
 * V2
 *******************************/

/**
 * create reaction to post
 *
 * @export
 * @param {ICreateReactionOptions} options
 * @return {*}  {Promise<IReaction>}
 */
export function createReactionV2(
  options: ICreateReactionOptions
): Promise<IReaction> {
  options.httpMethod = "POST";
  return discussionsApiRequestV2(`/reactions`, options);
}

/**
 * remove reaction
 *
 * @export
 * @param {IRemoveReactionOptions} options
 * @return {*}  {Promise<IRemoveReactionResponse>}
 */
export function removeReactionV2(
  options: IRemoveReactionOptions
): Promise<IRemoveReactionResponse> {
  const { reactionId } = options;
  options.httpMethod = "DELETE";
  return discussionsApiRequestV2(`/reactions/${reactionId}`, options);
}
