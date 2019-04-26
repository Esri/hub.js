import { ISearchResult } from "@esri/arcgis-rest-items";
import { IItem } from "@esri/arcgis-rest-common-types";

// implements the 'downloadable' facet from AGO results. V3 datasets have this property computed
// during the harvesting process but AGO results need this result computed at runtime
export function downloadable(response: ISearchResult): any {
  // Get counts of true and false for downloadable facet
  // i.e. { true: 10, false: 15 }
  return response.results.reduce(
    (formattedAggs: any, result: IItem) => {
      if (
        result.typeKeywords.indexOf("Data") > -1 ||
        downloadableTypes.indexOf(result.type) > -1
      ) {
        formattedAggs.downloadable.true++;
      } else {
        formattedAggs.downloadable.false++;
      }
      return formattedAggs;
    },
    { downloadable: { true: 0, false: 0 } }
  );
}

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
