import { IHubDiscussion } from "../core/types";
import { IModel } from "../types";

export const HUB_DISCUSSION_ITEM_TYPE = "Discussion";

/**
 * Default values of a IHubDiscussion
 */
export const DEFAULT_DISCUSSION: Partial<IHubDiscussion> = {
  name: "No title provided",
  tags: [],
  typeKeywords: ["Hub Discussion"],
  permissions: [],
  schemaVersion: 1,
  isDiscussable: true,
};

/**
 * Default values for a new HubDiscussion Model
 */
export const DEFAULT_DISCUSSION_MODEL: IModel = {
  item: {
    type: HUB_DISCUSSION_ITEM_TYPE,
    title: "No Title Provided",
    description: "No Description Provided",
    snippet: "",
    tags: [],
    typeKeywords: ["Hub Discussion"],
    properties: {
      slug: "",
      schemaVersion: 1,
    },
  },
  data: {
    prompt: "We want to hear from you!",
  },
} as unknown as IModel;
