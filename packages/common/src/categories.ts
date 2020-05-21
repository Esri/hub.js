const app: string[] = [
  "Application",
  "Dashboard",
  "Form",
  "Insights Page",
  "Insights Workbook",
  "Operation View",
  "Web Mapping Application",
  "StoryMap",
  "Web Experience"
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
  "Table"
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
  "PDF",
  "Pro Map",
  "Report Template"
];

const event: string[] = ["Hub Event"];

const initiative: string[] = ["Hub Initiative"];

const map: string[] = [
  "City Engine Web Scene",
  "CityEngine Web Scene",
  "Image Collection",
  "Image Service",
  "Map Service Layer",
  "Map Service",
  "Scene Service",
  "Vector Tile Service",
  "Web Map Service",
  "Web Map Tile Service",
  "Web Map",
  "Web Scene",
  "WFS",
  "WMS"
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
  "Workflow Manager Package"
];

const site: string[] = ["Hub Site Application", "Site Application"];

// eligible types are listed here: http://doc.arcgis.com/en/arcgis-online/reference/supported-items.htm
const downloadableTypes: string[] = [
  "360 VR Experience",
  "Application",
  "CityEngine Web Scene",
  "Code Sample",
  "CSV Collection",
  "CSV",
  "CAD Drawing",
  "Desktop Application",
  "Desktop Application Template",
  "Desktop Style",
  "File Geodatabase",
  "GeoJson",
  "Geoprocessing Package",
  "Geoprocessing Sample",
  "Image",
  "iWork Keynote",
  "iWork Numbers",
  "KML Collection",
  "KML",
  "Layer",
  "Layer File",
  "Layer Package",
  "Layout",
  "Locator Package",
  "Map Package",
  "Map Service Definition",
  "Map Template",
  "Microsoft Excel",
  "Microsoft Powerpoint",
  "Microsoft Visio",
  "Microsoft Word",
  "Operations Dashboard Add In",
  "PDF",
  "Pro Map",
  "Project Package",
  "Project Template",
  "Raster function template",
  "Rule Package",
  "Service Definition",
  "Shapefile",
  "Vector Tile Package",
  "Workflow Manager Package"
];

const downloadableTypeKeywords: string[] = ["Data"];

const apiTypes: string[] = ["Feature Service", "Map Service", "Image Service"];

export const categories: { [key: string]: string[] } = {
  app,
  dataset,
  document,
  event,
  initiative,
  map,
  other,
  site,
  downloadableTypes,
  downloadableTypeKeywords,
  apiTypes
};
