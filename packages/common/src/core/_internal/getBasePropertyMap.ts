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
    "type",
    "typeKeywords",
    "thumbnail",
    "url",
  ];
  const dataProps = ["display", "geometry", "view"];
  const resourceProps = ["location"];
  const map: IPropertyMap[] = [];
  itemProps.forEach((entry) => {
    map.push({ objectKey: entry, modelKey: `item.${entry}` });
  });
  dataProps.forEach((entry) => {
    map.push({ objectKey: entry, modelKey: `data.${entry}` });
  });
  resourceProps.forEach((entry) => {
    map.push({ objectKey: entry, modelKey: `resources.${entry}` });
  });
  // Deeper mappings
  map.push({
    objectKey: "slug",
    modelKey: "item.properties.slug",
  });
  map.push({
    objectKey: "summary",
    modelKey: "item.snippet",
  });
  map.push({
    objectKey: "schemaVersion",
    modelKey: "item.properties.schemaVersion",
  });
  map.push({
    objectKey: "orgUrlKey",
    modelKey: "item.properties.orgUrlKey",
  });
  map.push({
    objectKey: "name",
    modelKey: "item.title",
  });
  map.push({
    objectKey: "boundary",
    modelKey: "item.properties.boundary",
  });
  return map;
}
