import { IHubProject } from "../core";
import { InitiativeDefaultFeatures } from "../initiatives/_internal/InitiativeBusinessRules";
import { IModel, HubEntityStatus } from "../hub-types";

export const HUB_PROJECT_ITEM_TYPE = "Hub Project";
export const HUB_PROJECT_CURRENT_SCHEMA_VERSION = 1.2;
/**
 * Default values of a IHubProject
 */
export const DEFAULT_PROJECT: Partial<IHubProject> = {
  catalog: { schemaVersion: 0 },
  name: "",
  permissions: [],
  schemaVersion: HUB_PROJECT_CURRENT_SCHEMA_VERSION,
  status: HubEntityStatus.notStarted,
  tags: [],
  typeKeywords: [HUB_PROJECT_ITEM_TYPE],
  view: {
    contacts: [],
    featuredContentIds: [],
    showMap: true,
    metricDisplays: [],
  },
  features: InitiativeDefaultFeatures,
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
      schemaVersion: HUB_PROJECT_CURRENT_SCHEMA_VERSION,
    },
  },
  data: {
    display: "about",
    permissions: [],
    catalog: {
      schemaVersion: 0,
    },
    status: HubEntityStatus.notStarted,
    view: {
      contacts: [],
      featuredContentIds: [],
      showMap: true,
      metricDisplays: [],
    },
  },
} as unknown as IModel;
