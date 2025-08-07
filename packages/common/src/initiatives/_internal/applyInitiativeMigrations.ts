import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getProp } from "../../objects/get-prop";
import { IHubCatalog } from "../../search/types/IHubCatalog";
import { IModel } from "../../hub-types";
import { cloneObject } from "../../util";
import { migrateInvalidTimeline } from "../../utils/internal/migrateInvalidTimeline";

export const INITIATIVE_SCHEMA_VERSION = 2.1;

/**
 * Apply all Initiative model migrations
 * @param model
 * @returns
 */
export function applyInitiativeMigrations(
  model: IModel,
  _requestOptions: IRequestOptions
): Promise<IModel> {
  if (
    getProp(model, "item.properties.schemaVersion") ===
    INITIATIVE_SCHEMA_VERSION
  ) {
    return Promise.resolve(model);
  } else {
    // apply upgrade functions in order...
    model = addDefaultCatalog(model);
    model = migrateInvalidTimeline(model, INITIATIVE_SCHEMA_VERSION);

    return Promise.resolve(model);
  }
}

/**
 * Apply the default catalog to the model
 * @param model
 * @returns
 */
function addDefaultCatalog(model: IModel): IModel {
  if (getProp(model, "item.properties.schemaVersion") >= 1.1) {
    return model;
  } else {
    const clone = cloneObject(model);
    // v0 of initiatives did not have a catalog, so we need to add one
    // based on the content group associated with the initiative
    const groupId = getProp(clone, "item.properties.contentGroupId");
    const group = groupId ? [groupId] : [];

    const catalog: IHubCatalog = {
      schemaVersion: 1,
      title: "Default Initiative Catalog",
      scopes: {
        item: {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  group,
                },
              ],
            },
          ],
        },
      },
      collections: [],
    };

    clone.data.catalog = catalog;

    // set the schema version
    if (!clone.item.properties) {
      clone.item.properties = {};
    }
    clone.item.properties.schemaVersion = 1.1;

    return clone;
  }
}

// migrateInvalidTimeline is now imported from util
