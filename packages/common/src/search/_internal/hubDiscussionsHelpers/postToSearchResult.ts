import { AccessLevel } from "../../../core/types/types";
import { IPost } from "../../../discussions/api/types";
import { HubFamily } from "../../../hub-types";
import { IHubSearchResult } from "../../types/IHubSearchResult";

/**
 * Resolves an IHubSearchResult for the given IPost record
 * @param post An IPost record
 * @returns a IHubSearchResult for the given IPost record
 */
// TODO: seem like geometry is deprecated in IHubSearchResult, should we add location here?
export function postToSearchResult(post: IPost): IHubSearchResult {
  const result = {
    id: post.id,
    type: "Post",
    title: post.title,
    name: post.title,
    body: post.body,
    status: post.status,
    discussion: post.discussion,
    postType: post.postType,
    channelId: post.channelId,
    channel: post.channel,
    parentId: post.parentId,
    parent: post.parent,
    replies: post.replies,
    replyCount: post.replyCount,
    reactions: post.reactions,
    createdDate: new Date(post.createdAt),
    createdDateSource: "post.createdAt",
    updatedDate: new Date(post.updatedAt),
    updatedDateSource: "post.updatedAt",
    creator: post.creator,
    editor: post.editor,
    access: null as AccessLevel, // TODO: confirm this is okay
    family: "post" as HubFamily,
  };
  return result;
}
