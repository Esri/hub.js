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
  options.method = "POST";
  return request(`/posts/${options.params.postId}/reactions`, options);
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
  options.method = "DELETE";
  return request(
    `/posts/${options.params.postId}/reactions/${options.params.reactionId}`,
    options
  );
}
