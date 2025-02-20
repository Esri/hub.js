import { IItem } from "@esri/arcgis-rest-portal";
import { IItemTemplate } from "../types";
import { cloneObject } from "../util";

export const itemPropsNotInTemplates = [
  "id",
  "isOrgItem",
  "proxyFilter",
  "ownerFolder",
  "protected",
  "owner",
  "created",
  "modified",
  "guid",
  "name",
  "access",
  "size",
  "listed",
  "numComments",
  "numRatings",
  "avgRating",
  "numViews",
  "scoreCompleteness",
  "groupDesignations",
  "listed",
  "screenshots",
  "banner",
  "appCategories",
  "industries",
  "languages",
  "largeThumbnail",
];

/**
 * Given an item, remove a standard set of properties not needed in a template
 * TODO: This should land in a templating helper lib in hub.js
 * @param {Object} item Item to be normalized
 */
export function normalizeSolutionTemplateItem(item: IItem): IItemTemplate {
  const template = cloneObject(item) as IItemTemplate;

  itemPropsNotInTemplates.forEach((prop) => {
    delete template[prop];
  });

  // set a bunch of things we do want
  template.extent = "{{organization.defaultExtentBBox}}";
  return template;
}
