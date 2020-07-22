import { DownloadFormat } from "../download-format"

export function convertToHubFormat(format: DownloadFormat ) {
  if (format === 'Shapefile') return 'shp';
  if (format === 'CSV') return 'csv';
  if (format === 'File Geodatabase') return 'fgdb';
  if (format === 'GeoJson') return 'geojson';
  if (format === 'KML') return 'kml';
  throw new Error (`Unsupported Hub download format: ${format}`)
}