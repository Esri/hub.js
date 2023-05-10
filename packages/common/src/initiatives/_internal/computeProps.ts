import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemThumbnailUrl } from "../../resources";
import { processEntityCapabilities } from "../../capabilities";
import { IModel } from "../../types";
import { InitiativeDefaultCapabilities } from "./InitiativeBusinessRules";
import { IHubInitiative } from "../../core";
import { upgradeCatalogSchema } from "../../search/upgradeCatalogSchema";
import { IHubCatalog } from "../../search/types/IHubCatalog";

/**
 * Given a model and an Initiative, set various computed properties that can't be directly mapped
 * @private
 * @param model
 * @param initiative
 * @param requestOptions
 * @returns
 */
export function computeProps(
  model: IModel,
  initiative: Partial<IHubInitiative>,
  requestOptions: IRequestOptions
): IHubInitiative {
  let token: string;
  if (requestOptions.authentication) {
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }
  // thumbnail url
  initiative.thumbnailUrl = getItemThumbnailUrl(
    model.item,
    requestOptions,
    token
  );

  // Handle Dates
  initiative.createdDate = new Date(model.item.created);
  initiative.createdDateSource = "item.created";
  initiative.updatedDate = new Date(model.item.modified);
  initiative.updatedDateSource = "item.modified";

  // Handle capabilities
  initiative.capabilities = processEntityCapabilities(
    model.data.settings?.capabilities || {},
    InitiativeDefaultCapabilities
  );

  // Handle Catalog
  // v1 of Initiatives did not have a Catalog, so we construct one
  // based on the contentGroupId; We add a projects Collection b/c
  // we know we'll want that, as well as a more generic item scope
  // that's simply bounded by the contentGroupId
  if (!model.data.catalog) {
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
                  groups: [model.properties.contentGroupId],
                },
              ],
            },
          ],
        },
      },
      collections: [
        {
          targetEntity: "item",
          key: "content",
          label: "Content",
          scope: {
            targetEntity: "item",
            filters: [
              {
                predicates: [
                  {
                    type: { not: ["Hub Project"] },
                  },
                ],
              },
            ],
          },
        },
        {
          targetEntity: "item",
          key: "projects",
          label: "Projects",
          scope: {
            targetEntity: "item",
            filters: [
              {
                predicates: [
                  {
                    type: "Hub Project",
                  },
                ],
              },
            ],
          },
        },
      ],
    };
  }
  const defaultOldCatalog = { groups: [] as string[] };
  if (model.properties.contentGroupId) {
    defaultOldCatalog.groups.push(model.properties.contentGroupId);
  }
  // we can use upgradeCatalogSchema to construct the Catalog object
  initiative.catalog = upgradeCatalogSchema(
    model.data.catalog || defaultOldCatalog
  );

  // cast b/c this takes a partial but returns a full object
  return initiative as IHubInitiative;
}
