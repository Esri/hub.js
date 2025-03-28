import { IHubSite } from "../core";
import { IModel } from "../hub-types";
import { SiteDefaultFeatures } from "./_internal/SiteBusinessRules";

export const HUB_SITE_ITEM_TYPE = "Hub Site Application";

/**
 * Default values of a IHubSite
 */
export const DEFAULT_SITE: Partial<IHubSite> = {
  name: "",
  tags: [],
  typeKeywords: ["Hub Site", "hubSite"],
  catalog: { schemaVersion: 0 },
  permissions: [],
  schemaVersion: 1,
  features: SiteDefaultFeatures,
};

/**
 * Default values for a new HubProject Model
 */
export const DEFAULT_SITE_MODEL: IModel = {
  item: {
    type: HUB_SITE_ITEM_TYPE,
    title: "",
    description: "",
    snippet: "",
    tags: [],
    typeKeywords: ["Hub Site", "hubSite"],
    properties: {
      slug: "",
      schemaVersion: 1,
    },
  },
  data: {
    catalog: { schemaVersion: 0 },
    layout: {},
  },
} as unknown as IModel;
