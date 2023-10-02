import { IGroup } from "@esri/arcgis-rest-types";
import { IHubGroup } from "../core/types/IHubGroup";

export const HUB_GROUP_TYPE = "Hub Group";

/**
 * Default values of a IHubGroup
 */
export const DEFAULT_GROUP: Partial<IHubGroup> = {
  name: "No title provided",
  access: "private",
  permissions: [],
  typeKeywords: [],
};

/**
 * Default values for a new HubGroup Model
 */
export const DEFAULT_GROUP_MODEL: IGroup = {
  type: HUB_GROUP_TYPE,
  title: "No Title Provided",
  description: "",
  access: "",
  snippet: "",
  tags: [],
} as unknown as IGroup;
