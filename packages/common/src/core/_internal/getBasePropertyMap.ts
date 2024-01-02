import { EntityResourceMap } from "../types";
import { IPropertyMap } from "./PropertyMapper";

/**
 * Returns an Array of IPropertyMap objects
 * that define the standard projection of properties from a IModel an entity interface
 * @returns
 */
export function getBasePropertyMap(): IPropertyMap[] {
  const itemProps = [
    "access",
    "created",
    "culture",
    "description",
    "extent",
    "id",
    "itemControl",
    "modified",
    "owner",
    "tags",
    "categories",
    "type",
    "typeKeywords",
    "thumbnail",
    "url",
    "orgId",
    "protected",
  ];
  const dataProps = ["display", "geometry", "view", "associations"];
  const resourceProps = Object.keys(EntityResourceMap);
  const map: IPropertyMap[] = [];
  itemProps.forEach((entry) => {
    map.push({ entityKey: entry, storeKey: `item.${entry}` });
  });
  dataProps.forEach((entry) => {
    map.push({ entityKey: entry, storeKey: `data.${entry}` });
  });
  resourceProps.forEach((entry) => {
    map.push({ entityKey: entry, storeKey: `resources.${entry}` });
  });
  // Deeper mappings
  map.push({
    entityKey: "slug",
    storeKey: "item.properties.slug",
  });
  map.push({
    entityKey: "summary",
    storeKey: "item.snippet",
  });
  map.push({
    entityKey: "schemaVersion",
    storeKey: "item.properties.schemaVersion",
  });
  map.push({
    entityKey: "orgUrlKey",
    storeKey: "item.properties.orgUrlKey",
  });
  map.push({
    entityKey: "name",
    storeKey: "item.title",
  });
  map.push({
    entityKey: "boundary",
    storeKey: "item.properties.boundary",
  });
  map.push({
    entityKey: "discussionSettings",
    storeKey: "entitySettings.settings.discussions",
  });
  map.push({
    entityKey: "entitySettingsId",
    storeKey: "entitySettings.id",
  });
  return map;
}
