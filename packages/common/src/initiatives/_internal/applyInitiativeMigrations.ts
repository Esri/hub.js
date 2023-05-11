import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getProp } from "../../objects/get-prop";
import { IHubCatalog } from "../../search/types/IHubCatalog";
import { IModel } from "../../types";

export const INITIATIVE_SCHEMA_VERSION = 2;

/**
 * Apply all Initiative model migrations
 * @param model
 * @returns
 */
export function applyInitiativeMigrations(
  model: IModel,
  requestOptions: IRequestOptions
): Promise<IModel> {
  if (
    getProp(model, "item.properties.schemaVersion") ===
    INITIATIVE_SCHEMA_VERSION
  ) {
    return Promise.resolve(model);
  } else {
    // apply upgrade functions in order...
    model = addDefaultCatalog(model);

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
    // ----------------------------------
    // TODO: Decide if we want to fetch the catalog from the site and use that
    // or if we just use the contentGroupId
    // ----------------------------------
    // v0 of initiatives did not have a catalog, so we need to add one
    // based on the content group associated with the initiative
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
                  groups: [model.item.properties?.contentGroupId],
                },
              ],
            },
          ],
        },
      },
      collections: [],
    };

    model.data.catalog = catalog;

    // set the schema version
    model.item.properties.schemaVersion = 1.1;

    return model;
  }
}
