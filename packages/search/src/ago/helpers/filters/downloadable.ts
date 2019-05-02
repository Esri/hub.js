import { getProp } from "@esri/hub-common";

// builds the filter for the 'downloadable' facet
export function downloadable(queryFilters: any) {
  const downloadTrue = (getProp(queryFilters, "downloadable.terms") || [])[0];
  let downloadFilter: string[];
  let typeKeywordFilter;
  if (downloadTrue === "true") {
    downloadFilter = downloadableTypes.map(type => {
      return `type:"${type}"`;
    });
    typeKeywordFilter = downloadableTypeKeywords.map(type => {
      return `typekeywords:"${type}"`;
    });
  } else {
    downloadFilter = downloadableTypes.map(type => {
      return `-type:"${type}"`;
    });
    typeKeywordFilter = downloadableTypeKeywords.map(type => {
      return `-typekeywords:"${type}"`;
    });
  }
  return `(${downloadFilter.concat(typeKeywordFilter).join(" OR ")})`;
}

const downloadableTypeKeywords = ["Data"];
// eligible types are listed here: http://doc.arcgis.com/en/arcgis-online/reference/supported-items.htm
const downloadableTypes = [
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
