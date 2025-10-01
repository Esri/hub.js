import { IPost } from "../../../discussions/api/types";
import { IHubSearchResult } from "../../types/IHubSearchResult";

/**
 * Resolves an IHubSearchResult for the given IPost record
 * @param post An IPost record
 * @returns a IHubSearchResult for the given IPost record
 */
// TODO: seem like geometry is deprecated in IHubSearchResult, should we add location here?
export function postToSearchResult(post: IPost): IHubSearchResult {
  return {
    access: null,
    createdDate: new Date(post.createdAt),
    createdDateSource: "post.createdAt",
    family: "post",
    id: post.id,
    location: null, // TODO
    name: post.title,
    owner: post.creator,
    rawResult: post,
    source: "",
    summary: post.body,
    type: "Post",
    updatedDate: new Date(post.updatedAt),
    updatedDateSource: "post.updatedAt",
  };
}
