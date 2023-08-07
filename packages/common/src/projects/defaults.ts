import { IHubProject, PROJECT_STATUSES } from "../core";
import { IModel } from "../types";

export const HUB_PROJECT_ITEM_TYPE = "Hub Project";

/**
 * Default values of a IHubProject
 */
export const DEFAULT_PROJECT: Partial<IHubProject> = {
  catalog: { schemaVersion: 0 },
  name: "",
  permissions: [],
  schemaVersion: 1,
  status: PROJECT_STATUSES.notStarted,
  tags: [],
  typeKeywords: [HUB_PROJECT_ITEM_TYPE],
  view: {
    contacts: [],
    featuredContentIds: [],
    showMap: true,
  },
};

/**
 * Default values for a new HubProject Model
 */
export const DEFAULT_PROJECT_MODEL: IModel = {
  item: {
    type: HUB_PROJECT_ITEM_TYPE,
    title: "",
    description: "",
    snippet: "",
    tags: [],
    typeKeywords: [HUB_PROJECT_ITEM_TYPE],
    properties: {
      slug: "",
      schemaVersion: 1,
    },
  },
  data: {
    display: "about",
    permissions: [],
    status: PROJECT_STATUSES.notStarted,
    view: {
      contacts: [],
      featuredContentIds: [],
      showMap: true,
    },
  },
} as unknown as IModel;
