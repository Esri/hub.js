/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { getProp, cloneObject } from "@esri/hub-common";
import { IInitiativeModel, IInitiativeItem } from "@esri/hub-common";

export function upgradeToOneDotOne(
  model: IInitiativeModel,
  portalUrl?: string
): IInitiativeModel {
  const curVersion = getProp(model, "item.properties.schemaVersion") || 0;
  if (curVersion < 1.1) {
    const clone = cloneObject(model) as IInitiativeModel;
    // store the schemaVersion
    clone.item.properties.schemaVersion = 1.1;
    // add the assets...
    if (!clone.data.assets) {
      clone.data.assets = [
        {
          id: "bannerImage",
          url: getResourceUrl(model.item.id, "detail-image.jpg", portalUrl),
          properties: {
            type: "resource",
            fileName: "detail-image.jpg",
            mimeType: "image/jepg"
          },
          license: {
            type: "none"
          }
        },
        {
          id: "iconDark",
          url: getResourceUrl(model.item.id, "icon-dark.png", portalUrl),
          properties: {
            type: "resource",
            fileName: "icon-dark.png",
            mimeType: "image/png"
          },
          license: {
            type: "none"
          }
        },
        {
          id: "iconLight",
          url: getResourceUrl(model.item.id, "icon-light.png", portalUrl),
          properties: {
            type: "resource",
            fileName: "icon-light.png",
            mimeType: "image/png"
          },
          license: {
            type: "none"
          }
        }
      ];
    }
    if (!clone.data.values.bannerImage) {
      clone.data.values.bannerImage = {
        source: "bannerImage",
        display: {
          position: { x: "50%", y: "10%" }
        }
      };
    }
    return clone;
  } else {
    // console.debug(`Not upgrading CurVersion: ${curVersion}`);
    return model;
  }
}

export function getResourceUrl(
  itemId: string,
  resourceName: string,
  portal?: string,
  folder?: string
): string {
  // default to www.arcgis.com
  const portalUrl = portal || "https://www.arcgis.com/sharing/rest";
  let url = `${portalUrl}/content/items/${itemId}/resources`;
  if (folder) {
    url = `${url}/${folder}/${resourceName}`;
  } else {
    url = `${url}/${resourceName}`;
  }
  return url;
}
