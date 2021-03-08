import { IGroup, IItem } from "@esri/arcgis-rest-portal";
import { IDiscussionParams } from "../types";

export const parseDiscussionURI = (discussion: string): IDiscussionParams => {
  // NOTE: cannot use new URL(discussion) to parse uri bc difference in node and browser implementation
  const [, source = null] = discussion.match(/^(\w*):\/\//) || [];
  const [, type = null] = discussion.match(/^\w*:\/\/(\w*)\/?/) || [];
  const [, pathname = ""] = discussion.match(/^\w*:\/\/\w*\/(\w*)\??/) || [];
  const [id, layer = null] = pathname.split("_");
  const uri = new URL(discussion);
  const features =
    (uri.searchParams.has("id") && uri.searchParams.get("id").split(",")) ||
    null;
  const attribute =
    (uri.searchParams.has("attribute") && uri.searchParams.get("attribute")) ||
    null;
  return {
    source,
    type,
    id: id || null,
    layer,
    features,
    attribute
  };
};

// TODO: this will inspect a group's properties to determine if it is discussable
export const isGroupDiscussable = (group: IGroup): boolean => {
  return true;
};

// TODO: this will inspect an item's properties to determine if it is discussable
export const isItemDiscussable = (item: IItem): boolean => {
  return true;
};
