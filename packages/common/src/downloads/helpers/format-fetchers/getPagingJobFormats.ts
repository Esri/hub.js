import { IDynamicDownloadFormat } from "../types";

export function getPagingJobFormats(): IDynamicDownloadFormat[] {
  // Formats are defined within the Hub API code
  return [
    { type: "dynamic", format: "csv" },
    { type: "dynamic", format: "shapefile" },
    { type: "dynamic", format: "kml" },
    { type: "dynamic", format: "geojson" },
  ];
}
