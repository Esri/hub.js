export enum DownloadFormats {
  Shapefile = "Shapefile",
  CSV = "CSV",
  KML = "KML",
  GeoJson = "GeoJson",
  Excel = "Excel",
  "File Geodatabase" = "File Geodatabase",
  "Feature Collection" = "Feature Collection",
  "Scene Package" = "Scene Package"
}

export type DownloadFormat = keyof typeof DownloadFormats;
