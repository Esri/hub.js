import { IHubPage } from "../core/types/IHubPage";
import { IModel } from "../hub-types";

export const HUB_PAGE_ITEM_TYPE = "Hub Page";
export const ENTERPRISE_PAGE_ITEM_TYPE = "Site Page";
export const PAGE_TYPE_KEYWORD = "hubPage";
export const HUB_PAGE_CURRENT_SCHEMA_VERSION = 1.1;
/**
 * Default values of a IHubPage
 */
export const DEFAULT_PAGE: Partial<IHubPage> = {
  name: "",
  permissions: [],
  schemaVersion: HUB_PAGE_CURRENT_SCHEMA_VERSION,
  tags: [],
  typeKeywords: [PAGE_TYPE_KEYWORD],
  view: {
    contacts: [],
    featuredContentIds: [],
    showMap: true,
  },
  layout: {
    sections: [],
  },
};

/**
 * Default values for a new HubPage Model
 */
export const DEFAULT_PAGE_MODEL: IModel = {
  item: {
    type: HUB_PAGE_ITEM_TYPE,
    title: "",
    description: "",
    snippet: "",
    tags: [],
    typeKeywords: [PAGE_TYPE_KEYWORD],
    properties: {
      slug: "",
      schemaVersion: HUB_PAGE_CURRENT_SCHEMA_VERSION,
    },
  },
  data: {
    values: {
      layout: {},
    },
  },
} as unknown as IModel;
