import { DownloadFormat } from "../download-format"

const HUB_FORMAT_LOOKUP: any = {
  'Shapefile': 'shp',
  'CSV': 'csv',
  'File Geodatabase': 'fgdb',
  'GeoJson': 'geojson',
  'KML': 'kml'
}

export function convertToHubFormat(format: DownloadFormat ): string {
  if (!HUB_FORMAT_LOOKUP[format]) {
    throw new Error (`Unsupported Hub download format: ${format}`)
  }
  return HUB_FORMAT_LOOKUP[format];
}