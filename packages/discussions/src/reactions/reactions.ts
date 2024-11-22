import { discussionsApiRequest } from "@esri/hub-common";
import {
  ICreateReactionOptions,
  IRemoveReactionOptions,
  IRemoveReactionResponse,
  IReaction,
} from "../types";

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
  options.httpMethod = "POST";
  return discussionsApiRequest(`/reactions`, options);
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
  const { reactionId } = options;
  options.httpMethod = "DELETE";
  return discussionsApiRequest(`/reactions/${reactionId}`, options);
}
