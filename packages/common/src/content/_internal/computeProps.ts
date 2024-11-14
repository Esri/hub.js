import { ArcGISIdentityManager, IRequestOptions } from "@esri/arcgis-rest-request";
import { getItemThumbnailUrl } from "../../resources";
import { IHubRequestOptions, IModel } from "../../types";
import { getItemHomeUrl } from "../../urls/get-item-home-url";
import {
  getAdditionalResources,
  getContentEditUrl,
  getHubRelativeUrl,
} from "./internalContentUtils";
import {
  IBaseExtendedProps,
  IContentExtendedProps,
  IHubEditableContent,
  IServiceExtendedProps,
} from "../../core/types/IHubEditableContent";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { isDiscussable } from "../../discussions";
import {
  hasServiceCapability,
  ServiceCapabilities,
} from "../hostedServiceUtils";
import { computeItemProps } from "../../core/_internal/computeItemProps";
import { getProp } from "../../objects";
import { IHubEditableContentEnrichments } from "../../items/_enrichments";
import { IItem } from "@esri/arcgis-rest-portal";
import { isService } from "../../resources/is-service";

export function computeProps (
  model: IModel,
  content: Partial<IHubEditableContent>,
  requestOptions: IRequestOptions,
  enrichments: IHubEditableContentEnrichments = {}
): IHubEditableContent {
  let token: string;
  if (requestOptions.authentication) {
    const session: ArcGISIdentityManager = requestOptions.authentication as ArcGISIdentityManager;
    token = session.token;
  }

  // compute base properties on content
  content = computeItemProps(model.item, content);

  // thumbnail url
  const thumbnailUrl = getItemThumbnailUrl(model.item, requestOptions, token);
  content.thumbnailUrl = thumbnailUrl;

  // NOTE: other entities encapsulate this in a computeLinks function
  content.links = {
    self: getItemHomeUrl(content.id, requestOptions),
    siteRelative: getHubRelativeUrl(
      content.type,
      content.slug || content.id,
      content.typeKeywords
    ),
    siteRelativeEntityType: getHubRelativeUrl(content.type),
    workspaceRelative: getRelativeWorkspaceUrl("content", content.id),
    thumbnail: thumbnailUrl,
    contentEditUrl: getContentEditUrl(model.item, requestOptions),
  };
  // cannot be null otherwise we'd get a validation
  // error that doesn't let us save the form
  content.licenseInfo = model.item.licenseInfo || "";

  // when we receive a schedule from the enrichments, we want to use it, otherwise default to automatic
  content.schedule = enrichments.schedule;

  // calculate extendedProps
  content.extendedProps = isService(content.url)
    ? getServiceExtendedProps(model.item, enrichments, requestOptions)
    : getContentExtendedProps(model.item, enrichments, requestOptions);

  // TODO: Remove once .serverQueryCapability, .serverExtractCapability, and .serverExtractFormats are removed
  if (enrichments.server) {
    content.serverQueryCapability = hasServiceCapability(
      ServiceCapabilities.QUERY,
      enrichments.server
    );
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

  // TODO: remove once .additionalResources is removed
  if (enrichments.metadata) {
    content.additionalResources = getAdditionalResources(
      model.item,
      enrichments.metadata,
      requestOptions as IHubRequestOptions
    );
  }

  return content as IHubEditableContent;
}

/**
 * @private
 *
 * Compute the extended props for a service-backed item (i.e., feature, map, or image service)
 *
 * @param item
 * @param enrichments
 * @param requestOptions
 * @returns extended props for a service-backed item
 */
function getServiceExtendedProps (
  item: IItem,
  enrichments: IHubEditableContentEnrichments,
  requestOptions: IRequestOptions
): IServiceExtendedProps {
  const baseProps = getBaseExtendedProps(item, enrichments, requestOptions);
  const result: IServiceExtendedProps = {
    ...baseProps,
    kind: "service",
  };

  if (enrichments.server) {
    result.server = enrichments.server;
    result.serverQueryCapability = hasServiceCapability(
      ServiceCapabilities.QUERY,
      enrichments.server
    );
    result.serverExtractCapability = hasServiceCapability(
      ServiceCapabilities.EXTRACT,
      enrichments.server
    );
    const extractFormatsList: string = getProp(
      enrichments,
      "server.supportedExportFormats"
    );
    result.serverExtractFormats =
      extractFormatsList && extractFormatsList.split(",");
  }

  return result;
}

/**
 * @private
 *
 * Compute the extended props for content items not backed by a service
 *
 * @param item
 * @param enrichments
 * @param requestOptions
 * @returns
 */
function getContentExtendedProps (
  item: IItem,
  enrichments: IHubEditableContentEnrichments,
  requestOptions: IRequestOptions
): IContentExtendedProps {
  const baseProps = getBaseExtendedProps(item, enrichments, requestOptions);
  return {
    ...baseProps,
    kind: "content",
  };
}

/**
 * @private
 *
 * Compute the extended props common to all content items.
 *
 * @param item
 * @param enrichments
 * @param requestOptions
 * @returns
 */
function getBaseExtendedProps (
  item: IItem,
  enrichments: IHubEditableContentEnrichments,
  requestOptions: IRequestOptions
): IBaseExtendedProps {
  return {
    kind: null, // To be populated by the specific extended props function
    metadata: enrichments.metadata,
    additionalResources: getAdditionalResources(
      item,
      enrichments.metadata,
      requestOptions as IHubRequestOptions
    ),
    downloads: getProp(item, "properties.downloads"),
  };
}
