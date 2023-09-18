import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemThumbnailUrl } from "../../resources";
import { IModel } from "../../types";
import { bBoxToExtent, extentToPolygon, isBBox } from "../../extent";
import { IExtent } from "@esri/arcgis-rest-types";
import Geometry = __esri.Geometry;
import { getItemHomeUrl } from "../../urls/get-item-home-url";
import { getHubRelativeUrl } from "./internalContentUtils";
import { IHubLocation } from "../../core/types/IHubLocation";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { isDiscussable } from "../../discussions";
import {
  hasServiceCapability,
  ServiceCapabilities,
} from "../hostedServiceUtils";
import { IItemAndIServerEnrichments } from "../../items/_enrichments";

// if called and valid, set 3 things -- else just return type custom
export const getItemExtent = (itemExtent: number[][]): IExtent => {
  return isBBox(itemExtent)
    ? ({ ...bBoxToExtent(itemExtent), type: "extent" } as unknown as IExtent)
    : undefined;
};

export function deriveLocationFromItemExtent(itemExtent?: number[][]) {
  const location: IHubLocation = { type: "custom" };
  const geometry: any = getItemExtent(itemExtent); // TODO: this needs to be fixed -tom
  if (geometry) {
    const convertedPolygon = {
      ...extentToPolygon(geometry),
      type: "polygon",
    } as unknown as Geometry;
    location.geometries = [convertedPolygon];
    location.spatialReference = geometry.spatialReference;
    location.extent = itemExtent;
  }
  return location;
}

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
  };

  // cannot be null otherwise we'd get a validation
  // error that doesn't let us save the form
  content.licenseInfo = model.item.licenseInfo || "";

  if (!content.location) {
    // build location if one does not exist based off of the boundary and the item's extent
    content.location =
      model.item.properties?.boundary === "none"
        ? { type: "none" }
        : deriveLocationFromItemExtent(model.item.extent);
  }

  content.isDiscussable = isDiscussable(content);

  if (enrichments.server) {
    content.serverExtractCapability = hasServiceCapability(
      ServiceCapabilities.EXTRACT,
      enrichments.server
    );
  }

  return content as IHubEditableContent;
}
