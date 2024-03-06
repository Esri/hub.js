import { IOgcItem } from "./interfaces";
import { IPost } from "../../../discussions";
import { IHubSearchResult } from "../../types";

export async function ogcItemToDiscussionPostResult(
  ogcItem: IOgcItem
): Promise<IHubSearchResult> {
  return {
    id: ogcItem.id,
    name: ogcItem.properties.title,
    summary: ogcItem.properties.body,
    createdDate: new Date(ogcItem.properties.createdAt),
    createdDateSource: "properties.createdAt",
    updatedDate: new Date(ogcItem.properties.updatedAt),
    updatedDateSource: "properties.updatedAt",
    type: ogcItem.properties.postType,
    owner: ogcItem.properties.creator,
    location: ogcItem.properties.geometry,
    created: new Date(ogcItem.properties.createdAt),
    modified: new Date(ogcItem.properties.updatedAt),
    title: ogcItem.properties.title,
    rawResult: ogcItem.properties,
    access: null,
    family: null,
  } as IHubSearchResult;
}
