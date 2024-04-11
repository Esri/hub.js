import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemThumbnailUrl } from "../../resources";
import { IModel } from "../../types";
import { getItemHomeUrl } from "../../urls/get-item-home-url";
import { getContentEditUrl, getHubRelativeUrl } from "./internalContentUtils";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { isDiscussable } from "../../discussions";
import {
  hasServiceCapability,
  ServiceCapabilities,
} from "../hostedServiceUtils";
import { IItemAndIServerEnrichments } from "../../items/_enrichments";
import { computeBaseProps } from "../../core/_internal/computeBaseProps";

export function computeProps(
  model: IModel,
  content: Partial<IHubEditableContent>,
  requestOptions: IRequestOptions,
  enrichments: IItemAndIServerEnrichments = {}
): IHubEditableContent {
  let token: string;
  if (requestOptions.authentication) {
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }

  // compute base properties on content
  content = computeBaseProps(model.item, content);

  // thumbnail url
  const thumbnailUrl = getItemThumbnailUrl(model.item, requestOptions, token);
  // TODO: Remove this once opendata-ui starts using `links.thumbnail` instead
  content.thumbnailUrl = thumbnailUrl;
  content.links = {
    self: getItemHomeUrl(content.id, requestOptions),
    siteRelative: getHubRelativeUrl(
      content.type,
      content.slug || content.id,
      content.typeKeywords
    ),
    workspaceRelative: getRelativeWorkspaceUrl("content", content.id),
    thumbnail: thumbnailUrl,
    contentEditUrl: getContentEditUrl(model.item, requestOptions),
  };
  // cannot be null otherwise we'd get a validation
  // error that doesn't let us save the form
  content.licenseInfo = model.item.licenseInfo || "";

  content.isDiscussable = isDiscussable(content);

  // TODO: schedule doesn't exist on the item quite yet, need to get it from the database like San mentioned
  content.schedule = model.item.schedule || { mode: "automatic" };

  if (enrichments.server) {
    content.serverExtractCapability = hasServiceCapability(
      ServiceCapabilities.EXTRACT,
      enrichments.server
    );
  }

  return content as IHubEditableContent;
}
