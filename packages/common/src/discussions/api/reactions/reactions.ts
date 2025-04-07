import {
  discussionsApiRequest,
  discussionsApiRequestV2,
} from "../discussions-api-request";
import {
  ICreateReactionOptions,
  IRemoveReactionOptions,
  IRemoveReactionResponse,
  IReaction,
} from "../types";

/**
 * create reaction to post
 *
 * @deprecated use createReactionV2 instead
 * @export
 * @param {ICreateReactionOptions} options
 * @return {*}  {Promise<IReaction>}
 */
export function createReaction(
  options: ICreateReactionOptions
): Promise<IReaction> {
  options.httpMethod = "POST";
  return discussionsApiRequest(`/reactions`, options);
}

/**
 * remove reaction
 *
 * @deprecated use removeReactionV2 instead
 * @export
 * @param {IRemoveReactionOptions} options
 * @return {*}  {Promise<IRemoveReactionResponse>}
 */
export function removeReaction(
  options: IRemoveReactionOptions
): Promise<IRemoveReactionResponse> {
  const { reactionId } = options;
  options.httpMethod = "DELETE";
  return discussionsApiRequest(`/reactions/${reactionId}`, options);
}

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
