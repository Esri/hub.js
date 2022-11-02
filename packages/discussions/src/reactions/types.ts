import { IPost } from "../posts";
import {
  IDiscussionsRequestOptions,
  IWithAuthor,
  IWithEditor,
  IWithTimestamps,
  PostReaction,
} from "../shared/types";

/**
 * representation of reaction entity
 *
 * @export
 * @interface IReaction
 * @extends {IWithAuthor}
 * @extends {IWithEditor}
 * @extends {IWithTimestamps}
 */
export interface IReaction extends IWithAuthor, IWithEditor, IWithTimestamps {
  id: string;
  value: PostReaction;
  postId?: string;
  post?: IPost;
}

/**
 * dto for creating a reaction
 *
 * @export
 * @interface ICreateReaction
 */
export interface ICreateReaction {
  postId: string;
  value: PostReaction;
}

/**
 * request options for creating a reaction to a post
 *
 * @export
 * @interface ICreateReactionOptions
 * @extends {IHubRequestOptions}
 */
export interface ICreateReactionOptions extends IDiscussionsRequestOptions {
  data: ICreateReaction;
}

/**
 * request options for deleting a reaction
 *
 * @export
 * @interface IRemoveReactionOptions
 * @extends {IHubRequestOptions}
 */
export interface IRemoveReactionOptions extends IDiscussionsRequestOptions {
  reactionId: string;
}

/**
 * delete reaction response properties
 *
 * @export
 * @interface IRemoveReactionResponse
 */
export interface IRemoveReactionResponse {
  success: boolean;
  reactionId: string;
}
