import { IHubDiscussion } from "../core/types";
import { IModel } from "../hub-types";

export const HUB_DISCUSSION_ITEM_TYPE = "Discussion";

/**
 * Default values of a IHubDiscussion
 */
export const DEFAULT_DISCUSSION: Partial<IHubDiscussion> = {
  name: "",
  tags: [],
  typeKeywords: ["Hub Discussion"],
  permissions: [],
  catalogs: [],
  catalog: { schemaVersion: 0 },
  schemaVersion: 1,
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
      schemaVersion: 1,
    },
  },
  data: {
    catalogs: [],
    catalog: { schemaVersion: 0 },
    prompt: "",
  },
} as unknown as IModel;
