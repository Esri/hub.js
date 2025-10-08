import { IPost } from "../../../discussions/api/types";
import { IHubSearchResult } from "../../types/IHubSearchResult";

/**
 * Resolves an IHubSearchResult for the given IPost record
 * @param post An IPost record
 * @returns a IHubSearchResult for the given IPost record
 */
export function postToSearchResult(post: IPost): IHubSearchResult {
  return {
    access: null,
    createdDate: new Date(post.createdAt),
    createdDateSource: "post.createdAt",
    family: "post",
    id: post.id,
    // Per Tom's advice, deferring supporting locations for posts for now. There are
    // some known typing issues related to the `IHubLocation.geometries` property at
    // this time. We should revisit this once `IHubLocation.geometries` type if fixed
    // and make sure to support translating GeoJSON GeometryCollections appropriately
    location: { type: "none" },
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
