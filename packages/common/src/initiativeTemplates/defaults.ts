import { IHubInitiativeTemplate } from "../core/types/IHubInitiativeTemplate";
import { IModel } from "../types";

export const HUB_INITIATIVE_TEMPLATE_ITEM_TYPE = "Hub Initiative Template";

/**
 * Default values of a IHubInitiativeTemplate
 */
export const DEFAULT_INITIATIVE_TEMPLATE: Partial<IHubInitiativeTemplate> = {
  // TODO
};

export const DEFAULT_INITIATIVE_TEMPLATE_MODEL: IModel = {
  item: {
    // TODO
    type: HUB_INITIATIVE_TEMPLATE_ITEM_TYPE,
    title: "",
    description: "",
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
    // TODO: fill out data section
    recommendedTemplates: [],
    siteSolutionId: "",
  },
} as unknown as IModel;
