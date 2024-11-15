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
  "3DTiles Package",
  "3DTiles Service",
  "API Key",
  "Activity",
  "Addin Package",
  "Administrative Report",
  "AllSource Project",
  "Analysis Model",
  "Apache Parquet",
  "App Bundle",
  "AppBuilder Extension",
  "AppBuilder Widget Package",
  "Application Configuration",
  "Application SDK",
  "ArcGIS Pro Add In",
  "ArcGIS Pro Configuration",
  "ArcPad Package",
  "Arcade Module",
  "Basemap Package",
  "Big Data Analytic",
  "Big Data File Share",
  "Code Attachment",
  "Code Sample",
  "Color Set",
  "Compact Tile Package",
  "Content Category Set",
  "Data Package Collection",
  "Data Pipeline",
  "Data Store",
  "Deep Learning Package",
  "Deep Learning Studio Project",
  "Desktop Add In",
  "Desktop Application",
  "Desktop Application Template",
  "Desktop Style",
  "Earth Configuration",
  "Esri Classification Schema",
  "Esri Classifier Definition",
  "Excalibur Imagery Project",
  "Experience Builder Widget",
  "Experience Builder Widget Package",
  "Explorer Add In",
  "Explorer Layer",
  "Explorer Map",
  "Export Package",
  "Featured Items",
  "Feed",
  "GML",
  "GeoBIM Application",
  "GeoBIM Project",
  "GeoPackage",
  "Geocoding Service",
  "Geodata Service",
  "Geoenrichment Service",
  "Geometry Service",
  "Geoprocessing Package",
  "Geoprocessing Sample",
  "Geoprocessing Service",
  "Globe Document",
  "Globe Service",
  "Group Layer",
  "IPS Configuration",
  "Indoors Map Configuration",
  "Insights Data Engineering Model",
  "Insights Data Engineering Workbook",
  "Insights Model",
  "Insights Script",
  "Insights Theme",
  "Insights Workbook Package",
  "Kernel Gateway Connection",
  "Knowledge Graph",
  "Knowledge Graph Layer",
  "Knowledge Graph Web Investigation",
  "Knowledge Studio Project",
  "Layer",
  "Layer File",
  "Layer Package",
  "Layer Template",
  "Layout",
  "Legend",
  "Living Atlas Export Package",
  "Locator Package",
  "Map Area",
  "Map Document",
  "Map Package",
  "Map Service Definition",
  "Map Template",
  "Media Layer",
  "Mission",
  "Mission Report",
  "Mission Template",
  "Mobile Application",
  "Mobile Basemap Package",
  "Mobile Map Package",
  "Mobile Scene Package",
  "Native Application",
  "Native Application Installer",
  "Native Application Template",
  "Network Analysis Service",
  "Notebook Code Snippet Library",
  "Notebook Code Snippets",
  "OGCFeatureServer",
  "Operations Dashboard Add In",
  "Operations Dashboard Extension",
  "Oriented Imagery Catalog",
  "Ortho Mapping Project",
  "Ortho Mapping Template",
  "Pro Presentation",
  "Pro Project",
  "Pro Report",
  "Pro Report Template",
  "Project Package",
  "Project Template",
  "Published Map",
  "QuickCapture Project",
  "Raster Function Template",
  "Real Time Analytic",
  "Reality Mapping Project",
  "Reality Studio Project",
  "Relational Database Connection",
  "Replication Package",
  "Rule Package",
  "SMX Item",
  "SMX Map",
  "SMX Theme",
  "SQLite Geodatabase",
  "Scene Document",
  "Scene Package",
  "Scene Package Part",
  "Server",
  "Service Definition",
  "Statistical Data Collection",
  "StoryMap Theme",
  "Style",
  "Suitability Model",
  "Survey123 Add In",
  "Symbol Service",
  "Symbol Set",
  "Task File",
  "Tile Package",
  "Urban Project",
  "User License Type Extension",
  "Vector Tile Package",
  "Video Service",
  "Viewer Configuration",
  "Visio Document",
  "WCS",
  "Web AppBuilder Widget",
  "Web Experience Template",
  "Web Link Chart",
  "Windows Mobile Package",
  "Windows Viewer Add In",
  "Workflow",
  "Workflow Manager Package",
  "Workflow Manager Service",
  "Workforce Project",
  "netCDF",
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
 * @returns An array of types, or undefined if collection is not found
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
