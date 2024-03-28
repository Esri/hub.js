import { IOgcItem } from "./interfaces";
import { IHubSearchResult } from "../../types";

/**
 * This method is responsible for converting an OGC item whose properties
 * represent an IPost into an IHubSearchResult. Although some fields do not
 * apply, this is being done such that result of a discussion post search
 * can automatically be used in a gallery.
 * @param ogcItem
 * @returns IHubSearchResult
 */
export async function ogcItemToDiscussionPostResult(
  ogcItem: IOgcItem
): Promise<IHubSearchResult> {
  return {
    // Base IHubSearchResult properties
    id: ogcItem.id,
    name: ogcItem.properties.title,
    summary: ogcItem.properties.body,
    createdDate: new Date(ogcItem.properties.createdAt),
    createdDateSource: "properties.createdAt",
    updatedDate: new Date(ogcItem.properties.updatedAt),
    updatedDateSource: "properties.updatedAt",
    type: "post",
    owner: ogcItem.properties.creator,
    location: null, // Discussion posts do not have custom location specifiably via item properties
    created: new Date(ogcItem.properties.createdAt),
    modified: new Date(ogcItem.properties.updatedAt),
    title: ogcItem.properties.title,
    rawResult: ogcItem,
    access: null,
    family: null,
  } as IHubSearchResult;
}
