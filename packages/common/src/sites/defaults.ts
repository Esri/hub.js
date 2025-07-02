import { IHubSite } from "../core";
import { IModel } from "../hub-types";
import { SiteDefaultFeatures } from "./_internal/SiteBusinessRules";

export const HUB_SITE_ITEM_TYPE = "Hub Site Application";

/**
 * Default values of a IHubSite
 */
export const DEFAULT_SITE: Partial<IHubSite> = {
  name: "",
  tags: [],
  typeKeywords: ["Hub Site", "hubSite"],
  catalog: { schemaVersion: 0 },
  assistant: {
    schemaVersion: 0,
    workflows: [
      {
        key: "search_workflow",
        label: "Data search",
        description:
          "This workflow is for questions about geographic data that can be answered from open data.",
        action: "search",
        response: "Query for the right dataset and filter.",
        sources: [],
      },
      {
        key: "crisis_workflow",
        label: "Personal crisis topics",
        description:
          "Relating to suicide, self harm, or other personal crisis.",
        action: "respond",
        response:
          "If you are in a crisis or feeling suicidal, please call 911 for emergency response or 988 for the Suicide and Crisis Lifeline.",
        sources: [],
      },
      {
        key: "disaster_workflow",
        label: "Disaster response",
        description: "Relating preparing for disaster, tornado, hurricanes.",
        action: "respond",
        response: "If this is an emergency, call 911.",
        sources: [],
      },
    ],
  },
  permissions: [],
  schemaVersion: 1,
  features: SiteDefaultFeatures,
};

/**
 * Default values for a new HubProject Model
 */
export const DEFAULT_SITE_MODEL: IModel = {
  item: {
    type: HUB_SITE_ITEM_TYPE,
    title: "",
    description: "",
    snippet: "",
    tags: [],
    typeKeywords: ["Hub Site", "hubSite"],
    properties: {
      slug: "",
      schemaVersion: 1,
    },
  },
  data: {
    catalog: { schemaVersion: 0 },
    layout: {},
  },
} as unknown as IModel;
