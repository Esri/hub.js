import { IHubDiscussion } from "../core/types/IHubDiscussion";
import { IModel } from "../hub-types";

export const HUB_DISCUSSION_ITEM_TYPE = "Discussion";
export const HUB_DISCUSSION_CURRENT_SCHEMA_VERSION = 1.1;

/**
 * Default values of a IHubDiscussion
 */
export const DEFAULT_DISCUSSION: Partial<IHubDiscussion> = {
  name: "",
  tags: [],
  typeKeywords: ["Hub Discussion"],
  permissions: [],
  catalog: { schemaVersion: 0 },
  schemaVersion: HUB_DISCUSSION_CURRENT_SCHEMA_VERSION,
  isDiscussable: true,
};

/**
 * Default values for a new HubDiscussion Model
 */
export const DEFAULT_DISCUSSION_MODEL: IModel = {
  item: {
    type: HUB_DISCUSSION_ITEM_TYPE,
    title: "",
    description: "",
    snippet: "",
    tags: [],
    typeKeywords: ["Hub Discussion"],
    properties: {
      slug: "",
      schemaVersion: HUB_DISCUSSION_CURRENT_SCHEMA_VERSION,
    },
  },
  data: {
    catalog: { schemaVersion: 0 },
    prompt: "",
  },
} as unknown as IModel;
