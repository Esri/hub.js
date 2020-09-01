import { collections } from "./collections";

const {
  app,
  dataset,
  document,
  event,
  feedback,
  initiative,
  map,
  other,
  site
} = collections;

// TODO: move downloadableTypes, downloadableTypeKeywords, and apiTypes
// out of this module and into modules that expose functions like
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

// TODO: remove this at next breaking version
// we're just keeping this for backwards compatibility
export const categories: { [key: string]: string[] } = {
  app: app.concat(feedback),
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
