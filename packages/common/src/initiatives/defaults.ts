import { IHubInitiative } from "../core/types";
import { HubEntityHero, HubEntityStatus, IModel } from "../hub-types";
import { InitiativeDefaultFeatures } from "./_internal/InitiativeBusinessRules";

export const HUB_INITIATIVE_ITEM_TYPE = "Hub Initiative";
export const HUB_INITIATIVE_CURRENT_SCHEMA_VERSION = 2.2;

/**
 * Default values of a IHubInitiative
 */
export const DEFAULT_INITIATIVE: Partial<IHubInitiative> = {
  name: "",
  tags: [],
  typeKeywords: ["hubInitiativeV2"],
  catalog: { schemaVersion: 0 },
  permissions: [],
  schemaVersion: HUB_INITIATIVE_CURRENT_SCHEMA_VERSION,
  status: HubEntityStatus.notStarted,
  features: InitiativeDefaultFeatures,
  view: {
    featuredContentIds: [],
    hero: HubEntityHero.map,
    metricDisplays: [],
  },
};

/**
 * Default values for a new HubInitiative Model
 */
export const DEFAULT_INITIATIVE_MODEL: IModel = {
  item: {
    type: HUB_INITIATIVE_ITEM_TYPE,
    title: "",
    description: "",
    snippet: "",
    tags: [],
    typeKeywords: ["hubInitiativeV2"],
    properties: {
      slug: "",
      schemaVersion: HUB_INITIATIVE_CURRENT_SCHEMA_VERSION,
    },
  },
  data: {
    catalog: { schemaVersion: 0 },
    status: HubEntityStatus.notStarted,
    view: {
      featuredContentIds: [],
      hero: HubEntityHero.map,
      metricDisplays: [],
    },
  },
} as unknown as IModel;
