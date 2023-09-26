import { IHubInitiativeTemplate } from "../core/types/IHubInitiativeTemplate";
import { IModel } from "../types";
import { InitiativeTemplateDefaultFeatures } from "./_internal/InitiativeTemplateBusinessRules";

export const HUB_INITIATIVE_TEMPLATE_ITEM_TYPE = "Hub Initiative Template";

/**
 * Default values of a IHubInitiativeTemplate
 */
export const DEFAULT_INITIATIVE_TEMPLATE: Partial<IHubInitiativeTemplate> = {
  catalog: { schemaVersion: 0 },
  name: "No title provided",
  permissions: [],
  tags: [],
  typeKeywords: [HUB_INITIATIVE_TEMPLATE_ITEM_TYPE],
  schemaVersion: 1, // TODO: what version is default right now?
  features: InitiativeTemplateDefaultFeatures,
};

export const DEFAULT_INITIATIVE_TEMPLATE_MODEL: IModel = {
  item: {
    type: HUB_INITIATIVE_TEMPLATE_ITEM_TYPE,
    title: "No Title Provided",
    description: "No Description Provided",
    snippet: "",
    tags: [],
    typeKeywords: [HUB_INITIATIVE_TEMPLATE_ITEM_TYPE],
    properties: {
      slug: "",
      schemaVersion: 1, // TODO: should this be 1?
      previewUrl: "",
    },
  },
  data: {
    recommendedTemplates: [],
    siteSolutionId: "",
  },
} as unknown as IModel;
