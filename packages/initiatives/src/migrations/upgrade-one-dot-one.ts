/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { getProp, cloneObject } from "@esri/hub-common";
import { IInitiativeModel, IInitiativeItem } from "@esri/hub-common";

/**
 * Apply the 1.0 --> 1.1 Migration to an Initiative Model
 *
 * @param model
 * @param portalUrl
 */
export function upgradeToOneDotOne(
  model: IInitiativeModel,
  portalUrl?: string
): IInitiativeModel {
  const curVersion = getProp(model, "item.properties.schemaVersion");
  if (curVersion < 1.1) {
    const clone = cloneObject(model) as IInitiativeModel;
    // store the schemaVersion
    clone.item.properties.schemaVersion = 1.1;
    // add the assets...
    addDefaultResources(clone, portalUrl);

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

/**
 * As part of the 1.1 migration, we add a set of default image
 * resources into the hash.
 *
 * @private
 * @param {IInitiativeModel} model
 * @param {string} [portalUrl]
 * @returns {IInitiativeModel}
 */
export function addDefaultResources(
  model: IInitiativeModel,
  portalUrl?: string
): IInitiativeModel {
  if (!model.data.assets) {
    model.data.assets = [
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
  return model;
}

/**
 * Construct the url for a resource. This is specific to the migration otherwise
 * if would be hoised into a more generic module
 *
 * @private
 * @param {string} itemId
 * @param {string} resourceName
 * @param {string} [portal]
 * @param {string} [folder]
 * @returns {string}
 */
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
