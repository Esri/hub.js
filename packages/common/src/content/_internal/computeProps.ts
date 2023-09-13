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
import { IHubLocationType } from "../../core/types/types";

// if called and valid, set 3 things -- else just return type custom
export const getItemExtent = (itemExtent: number[][]): IExtent => {
  return isBBox(itemExtent)
    ? ({ ...bBoxToExtent(itemExtent), type: "extent" } as unknown as IExtent)
    : undefined;
};

export function deriveLocationFromItemExtent(
  locationType: IHubLocationType,
  itemExtent?: number[][]
) {
  const location: IHubLocation = { type: locationType };
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

export async function computeProps(
  model: IModel,
  content: Partial<IHubEditableContent>,
  requestOptions: IRequestOptions
): Promise<IHubEditableContent> {
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

  // If modelLocationType === "custom" and modelBoundaryIsItem is true
  // BUT THE EXTENTS AS BBOX'S DO NOT MATCH
  // use item rather than custom
  // this is a weird edge case where someone has:
  // 1. saved their content with a custom location in the new view
  // 2. then saved their content with the item's extent in the old view

  const modelBoundary = model.item.properties?.boundary;
  const modelLocationType = model.item.properties?.location.type;
  const modelBoundaryIsItem = modelBoundary === "item";
  const forLoadedSelection =
    (modelLocationType === "org" || modelLocationType === "custom") &&
    modelBoundaryIsItem
      ? modelLocationType
      : modelBoundary;

  if (forLoadedSelection === "none") {
    content.location = { type: "none" };
  } else if (
    (modelLocationType === "custom" || modelLocationType === "org") &&
    modelBoundaryIsItem &&
    !(model.item.extent === model.item.properties?.location.extent)
  ) {
    // if the two extents do not match, then that signifies it was saved
    //   in the old view after being saved in the new
    content.location = deriveLocationFromItemExtent("item", model.extent);
  } else if (forLoadedSelection === "item" || forLoadedSelection === "org") {
    content.location = deriveLocationFromItemExtent(
      forLoadedSelection,
      model.item.extent
    );
  }
  // custom has already been through the ropes and doesn't need any adjustments

  return content as IHubEditableContent;
}
