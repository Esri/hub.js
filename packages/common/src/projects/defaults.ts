import { IHubProject } from "../core";
import { IModel } from "../types";

export const HUB_PROJECT_ITEM_TYPE = "Hub Project";

/**
 * Default values of a IHubProject
 */
export const DEFAULT_PROJECT: Partial<IHubProject> = {
  name: "No title provided",
  tags: [],
  typeKeywords: ["Hub Project"],
  status: "inactive",
};

/**
 * Default values for a new HubProject Model
 */
export const DEFAULT_PROJECT_MODEL: IModel = {
  item: {
    type: HUB_PROJECT_ITEM_TYPE,
    title: "No Title Provided",
    description: "No Description Provided",
    snippet: "",
    tags: [],
    typeKeywords: ["Hub Project"],
    properties: {
      slug: "",
    },
  },
  data: {
    display: "about",
    timeline: {},
    status: "inactive",
    contacts: [],
    schemaVersion: 1,
  },
} as unknown as IModel;
