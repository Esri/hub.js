import { request } from "./request";
import { ICreateReactionOptions, IDeleteReactionOptions } from "./types";

export function createReaction(options: ICreateReactionOptions) {
  options.method = "POST";
  return request(`/posts/${options.params.postId}/reactions`, options);
}

export function deleteReaction(options: IDeleteReactionOptions) {
  options.method = "DELETE";
  return request(
    `/posts/${options.params.postId}/reactions/${options.params.reactionId}`,
    options
  );
}
