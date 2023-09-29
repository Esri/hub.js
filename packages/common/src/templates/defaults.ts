import { IHubTemplate } from "../core/types/IHubTemplate";
import { TemplateDefaultFeatures } from "./_internal/TemplateBusinessRules";
import { IModel } from "../types";

/**
 * NOTE: this file provides default values for new
 * Hub Template creation; however, we have no immediate
 * plans to allow template creation from the context of
 * our application. Scaffolding these defaults for
 * potential future implementation
 */

export const HUB_TEMPLATE_ITEM_TYPE = "Solution";

/** Default values for a new IHubTemplate */
export const DEFAULT_TEMPLATE: Partial<IHubTemplate> = {
  schemaVersion: 1,
  catalog: { schemaVersion: 0 },
  name: "",
  tags: [],
  typeKeywords: [HUB_TEMPLATE_ITEM_TYPE],
  view: {},
  permissions: [],
  features: TemplateDefaultFeatures,
};

/** Default values for a new HubTemplate Model (backing item) */
export const DEFAULT_TEMPLATE_MODEL: IModel = {
  item: {
    type: HUB_TEMPLATE_ITEM_TYPE,
    title: "",
    description: "",
    snippet: "",
    tags: [],
    typeKeywords: [HUB_TEMPLATE_ITEM_TYPE],
    properties: {
      slug: "",
      schemaVersion: 1,
    },
  },
  data: {
    permissions: [],
    view: {},
  },
} as unknown as IModel;
