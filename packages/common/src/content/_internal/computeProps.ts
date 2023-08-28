import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemThumbnailUrl } from "../../resources";
import { IHubEditableContent, IHubLocation } from "../../core";
import { IModel } from "../../types";
import { bBoxToExtent, extentToPolygon, isBBox } from "../../extent";
import { IExtent } from "@esri/arcgis-rest-types";
import Geometry = __esri.Geometry;

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
  requestOptions: IRequestOptions
): IHubEditableContent {
  let token: string;
  if (requestOptions.authentication) {
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }
  // thumbnail url
  content.thumbnailUrl = getItemThumbnailUrl(model.item, requestOptions, token);
  content.licenseInfo = model.item.licenseInfo || "";

  if (!content.location) {
    // build location if one does not exist based off of the boundary and the item's extent
    content.location =
      model.item.properties?.boundary === "none"
        ? { type: "none" }
        : deriveLocationFromItemExtent(model.item.extent);
  }

  return content as IHubEditableContent;
}
