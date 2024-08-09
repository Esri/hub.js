import { IHubPage } from "../core";
import { IModel } from "../types";

export const HUB_PAGE_ITEM_TYPE = "Hub Page";
export const ENTERPRISE_PAGE_ITEM_TYPE = "Site Page";
export const PAGE_TYPE_KEYWORD = "hubPage";
/**
 * Default values of a IHubPage
 */
export const DEFAULT_PAGE: Partial<IHubPage> = {
  name: "",
  permissions: [],
  schemaVersion: 1,
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
      schemaVersion: 1,
    },
  },
  data: {
    values: {
      layout: {},
    },
  },
} as unknown as IModel;
