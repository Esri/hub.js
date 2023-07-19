import { IHubGroup } from "../core/types/IHubGroup";
import { IModel } from "../types";

export const HUB_GROUP_TYPE = "Hub Group";

/**
 * Default values of a IHubGroup
 */
export const DEFAULT_GROUP: Partial<IHubGroup> = {
  name: "No title provided",
  access: "private",
  permissions: [],
};

/**
 * Default values for a new HubGroup Model
 */
export const DEFAULT_GROUP_MODEL: IModel = {
  type: HUB_GROUP_TYPE,
  title: "No Title Provided",
  description: "",
  access: "",
  snippet: "",
  tags: [],
} as unknown as IModel;
