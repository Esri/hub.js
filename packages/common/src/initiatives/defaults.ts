import { IHubInitiative } from "../core/types";
import { IModel } from "../types";
import { InitiativeDefaultFeatures } from "./_internal/InitiativeBusinessRules";

export const HUB_INITIATIVE_ITEM_TYPE = "Hub Initiative";

/**
 * Default values of a IHubInitiative
 */
export const DEFAULT_INITIATIVE: Partial<IHubInitiative> = {
  name: "No title provided",
  tags: [],
  typeKeywords: ["Hub Initiative"],
  catalog: { schemaVersion: 0 },
  permissions: [],
  schemaVersion: 2,
  features: InitiativeDefaultFeatures,
};

/**
 * Default values for a new HubInitiative Model
 */
export const DEFAULT_INITIATIVE_MODEL: IModel = {
  item: {
    type: HUB_INITIATIVE_ITEM_TYPE,
    title: "No Title Provided",
    description: "No Description Provided",
    snippet: "",
    tags: [],
    typeKeywords: ["Hub Initiative"],
    properties: {
      slug: "",
      schemaVersion: 2,
    },
  },
  data: {},
} as unknown as IModel;
