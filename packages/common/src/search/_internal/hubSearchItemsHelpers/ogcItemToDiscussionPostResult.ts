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
    type: ogcItem.properties.postType,
    owner: ogcItem.properties.creator,
    location: ogcItem.properties.geometry,
    created: new Date(ogcItem.properties.createdAt),
    modified: new Date(ogcItem.properties.updatedAt),
    title: ogcItem.properties.title,
    rawResult: ogcItem.properties,
    access: null,
    family: null,

    // Post properties
    channelId: ogcItem.properties.channelId,
    postType: ogcItem.properties.postType,
    discussion: ogcItem.properties.discussion,
    entityId: ogcItem.properties.entityId,
    entityType: ogcItem.properties.entityType,
    entityLayerId: ogcItem.properties.entityLayerId,
    status: ogcItem.properties.status,
    creator: ogcItem.properties.creator,
    editor: ogcItem.properties.editor,
    createdAt: new Date(ogcItem.properties.createdAt),
    updatedAt: new Date(ogcItem.properties.updatedAt),
    deletedAt: ogcItem.properties.deletedAt
      ? new Date(ogcItem.properties.deletedAt)
      : null,
    parentId: ogcItem.properties.parentId,
    body: ogcItem.properties.body,
    mentions: ogcItem.properties.mentions,
    asAnonymous: ogcItem.properties.asAnonymous,
    geometry: ogcItem.geometry,
    featureGeometry: ogcItem.properties.featureGeometry,
    originUrl: ogcItem.properties.originUrl,
    appInfo: ogcItem.properties.appInfo,
    totalReplies: ogcItem.properties.totalReplies,
    totalReactions: ogcItem.properties.totalReactions,

    // Channel properties
    channelName: ogcItem.properties.channelName,
    channelCreator: ogcItem.properties.channelCreator,
    channelEditor: ogcItem.properties.channelEditor,
    channelCreatedAt: new Date(ogcItem.properties.channelCreatedAt),
    channelUpdatedAt: new Date(ogcItem.properties.channelUpdatedAt),
    channelDeletedAt: ogcItem.properties.channelDeletedAt
      ? new Date(ogcItem.properties.channelDeletedAt)
      : null,
  } as IHubSearchResult;
}
