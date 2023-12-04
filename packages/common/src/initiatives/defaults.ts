import { IHubInitiative } from "../core/types";
import { HubEntityHero, HubEntityStatus, IModel } from "../types";
import { InitiativeDefaultFeatures } from "./_internal/InitiativeBusinessRules";

export const HUB_INITIATIVE_ITEM_TYPE = "Hub Initiative";

/**
 * Default values of a IHubInitiative
 */
export const DEFAULT_INITIATIVE: Partial<IHubInitiative> = {
  name: "",
  tags: [],
  typeKeywords: ["hubInitiativeV2"],
  catalog: { schemaVersion: 0 },
  permissions: [],
  schemaVersion: 2,
  status: HubEntityStatus.notStarted,
  features: InitiativeDefaultFeatures,
  view: {
    featuredContentIds: [],
    hero: HubEntityHero.map,
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
      schemaVersion: 2,
    },
  },
  data: {
    status: HubEntityStatus.notStarted,
    view: {
      featuredContentIds: [],
      hero: HubEntityHero.map,
    },
  },
} as unknown as IModel;
