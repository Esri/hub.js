import { request } from "./request";
import {
  ICreateReactionOptions,
  IRemoveReactionOptions,
  IRemoveReactionResponse,
  IReaction
} from "./types";

/**
 * create reaction to post
 *
 * @export
 * @param {ICreateReactionOptions} options
 * @return {*}  {Promise<IReaction>}
 */
export function createReaction(
  options: ICreateReactionOptions
): Promise<IReaction> {
  const { postId } = options;
  options.httpMethod = "POST";
  return request(`/posts/${postId}/reactions`, options);
}

/**
 * remove reaction
 *
 * @export
 * @param {IRemoveReactionOptions} options
 * @return {*}  {Promise<IRemoveReactionResponse>}
 */
export function removeReaction(
  options: IRemoveReactionOptions
): Promise<IRemoveReactionResponse> {
  const { postId, reactionId } = options;
  options.httpMethod = "DELETE";
  return request(`/posts/${postId}/reactions/${reactionId}`, options);
}
