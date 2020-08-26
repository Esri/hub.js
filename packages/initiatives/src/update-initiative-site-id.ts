/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IItem } from "@esri/arcgis-rest-portal";
import { IModel, IHubRequestOptions, getProp, isGuid } from "@esri/hub-common";
import { updateItem, getItem } from "@esri/arcgis-rest-portal";

/**
 * Update the Site associated with an Initiative by setting the
 * `item.properties.siteId` to a new value
 *
 * Used during createSite(...) and any time we need to
 * connect a different Site to an Initiative
 *
 * @param initiativeItemId string | IItem | IModel
 * @param siteId string
 * @param hubRequestOptions IHubRequestOptions
 */
export function updateInitiativeSiteId(
  maybeModel: string | IItem | IModel,
  siteId: string,
  hubRequestOptions: IHubRequestOptions
): Promise<any> {
  // assume it's an IItem
  let itemPromise = Promise.resolve(maybeModel);

  // if we got a string, treat it as an id
  if (typeof maybeModel === "string") {
    if (!isGuid(maybeModel)) {
      return Promise.reject(
        new Error(
          "updateInitiativeSiteId was passed a string that is not a GUID."
        )
      );
    } else {
      itemPromise = getItem(maybeModel, {
        authentication: hubRequestOptions.authentication
      });
    }
  } else {
    // if it's an IModel it will have `.item.id` defined
    if (getProp(maybeModel as IModel, "item.id")) {
      const m = maybeModel as IModel;
      itemPromise = Promise.resolve(m.item);
    }
  }

  // kick off the promise that will return an IItem
  return itemPromise.then((item: any) => {
    // oddly, IItem does not have .properties even as an optional O_o
    // regardless, ensure .properties exists
    if (!item.properties) {
      item.properties = {};
    }
    // set the siteId
    item.properties.siteId = siteId;
    // and... update the item
    return updateItem({
      item,
      authentication: hubRequestOptions.authentication
    });
  });
}
