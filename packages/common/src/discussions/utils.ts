import { IGroup, IItem } from "@esri/arcgis-rest-types";
import { IHubContent, IHubItemEntity } from "../core";
import { CANNOT_DISCUSS } from "./constants";

/**
 * Utility to determine if a given IGroup, IItem, IHubContent, or IHubItemEntity
 * is discussable.
 * @export
 * @param {IGroup|IItem|IHubContent|IHubItemEntity} The subject to evaluate
 * @return {boolean}
 */
export function isDiscussable(
  subject: IGroup | IItem | IHubContent | IHubItemEntity
) {
  return !(subject.typeKeywords ?? []).includes(CANNOT_DISCUSS);
}
