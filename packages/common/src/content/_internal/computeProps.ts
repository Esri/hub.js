import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemThumbnailUrl } from "../../resources";
import { IHubRequestOptions, IModel } from "../../types";
import { getItemHomeUrl } from "../../urls/get-item-home-url";
import {
  getAdditionalResources,
  getContentEditUrl,
  getHubRelativeUrl,
} from "./internalContentUtils";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { isDiscussable } from "../../discussions";
import {
  hasServiceCapability,
  ServiceCapabilities,
} from "../hostedServiceUtils";
import { computeBaseProps } from "../../core/_internal/computeBaseProps";
import { getProp } from "../../objects";
import { IHubEditableContentEnrichments } from "../../items/_enrichments";

export function computeProps(
  model: IModel,
  content: Partial<IHubEditableContent>,
  requestOptions: IRequestOptions,
  enrichments: IHubEditableContentEnrichments = {}
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

  // when we receive a schedule from the enrichments, we want to use it, otherwise default to automatic
  content.schedule = enrichments.schedule;

  if (enrichments.server) {
    content.serverExtractCapability = hasServiceCapability(
      ServiceCapabilities.EXTRACT,
      enrichments.server
    );
    const extractFormatsList: string = getProp(
      enrichments,
      "server.supportedExportFormats"
    );
    content.serverExtractFormats =
      extractFormatsList && extractFormatsList.split(",");
  }

  if (enrichments.metadata) {
    content.additionalResources = getAdditionalResources(
      model.item,
      enrichments.metadata,
      requestOptions as IHubRequestOptions
    );
  }

  return content as IHubEditableContent;
}
