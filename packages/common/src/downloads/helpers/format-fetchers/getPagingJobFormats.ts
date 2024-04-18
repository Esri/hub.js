import { HubPagingJobFormat, IDynamicDownloadFormat } from "../types";

export function getPagingJobFormats(): IDynamicDownloadFormat[] {
  // Formats are defined within the Hub API code
  // TODO: Use enums instead of casting strings
  return [
    { type: "dynamic", format: "csv" as HubPagingJobFormat },
    { type: "dynamic", format: "shapefile" as HubPagingJobFormat },
    { type: "dynamic", format: "kml" as HubPagingJobFormat },
    { type: "dynamic", format: "geojson" as HubPagingJobFormat },
  ];
}
