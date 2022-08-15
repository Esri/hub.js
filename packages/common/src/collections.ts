const app: string[] = [
  "Application",
  "City Engine Web Scene",
  "CityEngine Web Scene",
  "Dashboard",
  "Insights Page",
  "Insights Workbook",
  "Operation View",
  "Web Mapping Application",
  "StoryMap",
  "Web Experience",
  "Urban Model",
];

const dataset: string[] = [
  "CSV Collection",
  "CSV",
  "Feature Collection Template",
  "Feature Collection",
  "Feature Layer",
  "Feature Service",
  "File Geodatabase",
  "GeoJSON",
  "GeoJson",
  "KML Collection",
  "KML",
  "Microsoft Excel",
  "Raster Layer",
  "Shapefile",
  "Stream Service",
  "Table",
];

const document: string[] = [
  "CAD Drawing",
  "Document Link",
  "Hub Page",
  "Site Page",
  "Image",
  "iWork Keynote",
  "iWork Numbers",
  "iWork Pages",
  "Microsoft Powerpoint",
  "Microsoft Visio",
  "Microsoft Word",
  "Notebook",
  "PDF",
  "Pro Map",
  "Report Template",
];

const event: string[] = ["Hub Event"];

const feedback: string[] = ["Form", "Quick Capture Project"];

const initiative: string[] = ["Hub Initiative"];

const solution: string[] = ["Solution"];

const template: string[] = ["Hub Initiative Template"];

const map: string[] = [
  "Image Collection",
  "Image Service",
  "Map Service Layer",
  "Map Service",
  "Scene Service",
  "Scene Layer",
  "Vector Tile Service",
  "Web Map Service",
  "Web Map Tile Service",
  "Web Map",
  "Web Scene",
  "WFS",
  "WMS",
  "WMTS",
];

const other: string[] = [
  "360 VR Experience",
  "AppBuilder Widget Package",
  "Application Configuration",
  "ArcPad Package",
  "Code Attachment",
  "Code Sample",
  "Desktop Add In",
  "Desktop Application Template",
  "Desktop Application",
  "Desktop Style",
  "Explorer Add In",
  "Explorer Layer",
  "Geocoding Service",
  "Geometry Service",
  "Geoprocessing Package",
  "Geoprocessing Sample",
  "Geoprocessing Service",
  "Layer File",
  "Layer Package",
  "Layer Template",
  "Layer",
  "Layout",
  "Locator Package",
  "Map Area",
  "Map Document",
  "Map Package",
  "Map Service Definition",
  "Map Template",
  "Mobile Application",
  "Mobile Map Package",
  "Native Application",
  "Network Analysis Service",
  "Operations Dashboard Add In",
  "Project Package",
  "Project Template",
  "Raster Function Template",
  "Rule Package",
  "Scene Package",
  "Service Definition",
  "SQLite Geodatabase",
  "Style",
  "Tile Package",
  "Vector Tile Package",
  "Workflow Manager Package",
];

const site: string[] = ["Hub Site Application", "Site Application"];

/**
 * Get the Hub collection for a given item type
 * @param itemType The ArcGIS [item type](https://developers.arcgis.com/rest/users-groups-and-items/items-and-item-types.htm).
 * @returns the Hub collection of a given item type.
 * @private
 */
export const getCollection = (type?: string) => {
  if (!type) {
    return;
  }
  const lowerCaseType = type.toLocaleLowerCase();
  return Object.keys(collections).find((key) => {
    const collectionTypes = collections[key];
    return collectionTypes.some((t) => t.toLocaleLowerCase() === lowerCaseType);
  });
};

/**
 * The converse of getCollection, returns associated types of provided collection
 * @param collection The Hub collection
 * @returns An array of types or undefined if collection is not found
 * @private
 */
export const getCollectionTypes = (collection?: string) => {
  if (!collection) {
    return;
  }
  const lowerCaseCollection = collection.toLocaleLowerCase();
  return collections[lowerCaseCollection];
};

// TODO: remove this when we remove the deprecated categories
// and then move the above arrays and getCollection() logic to get-family
export const collections: { [key: string]: string[] } = {
  app,
  dataset,
  document,
  event,
  feedback,
  initiative,
  template,
  solution,
  map,
  other,
  site,
};
