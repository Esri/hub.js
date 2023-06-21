import { IGroup, IItem } from "@esri/arcgis-rest-types";
import { IHubContent, IHubItemEntity } from "../core";
import { CANNOT_DISCUSS } from "./constants";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { updateItem, updateGroup } from "@esri/arcgis-rest-portal";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

/**
 * Utility to determine if a given IGroup, IItem, IHubContent, or IHubItemEntity
 * is discussable.
 * @param {IGroup|IItem|IHubContent|IHubItemEntity} subject
 * @return {boolean}
 */
export function isDiscussable(
  subject: Partial<IGroup | IItem | IHubContent | IHubItemEntity>
) {
  return !(subject.typeKeywords ?? []).includes(CANNOT_DISCUSS);
}

/**
 * Adds or removes CANNOT_DISCUSS type keyword and returns the updated list
 * @param {IGroup|IHubContent|IHubItemEntity} subject
 * @param {boolean} discussable
 * @returns {string[]} updated list of type keywords
 */
export function setDiscussableKeyword(
  typeKeywords: string[],
  discussable: boolean
): string[] {
  const updatedTypeKeywords = typeKeywords.filter(
    (typeKeyword: string) => typeKeyword !== CANNOT_DISCUSS
  );
  if (!discussable) {
    updatedTypeKeywords.push(CANNOT_DISCUSS);
  }
  return updatedTypeKeywords;
}
