/**
 * Comprehensive enum of all the download formats that are supported by service-backed items across the ArcGIS platform.
 */
export enum ServiceDownloadFormat {
  // Image Service Formats
  BMP = "bmp",
  GIF = "gif",
  JPG = "jpg",
  JPG_PNG = "jpgpng",
  PNG = "png",
  PNG8 = "png8",
  PNG24 = "png24",
  TIFF = "tiff",
  PNG32 = "png32", // 10.2+
  BIP = "bip", // 10.3+
  BSQ = "bsq", // 10.3+
  LERC = "lerc", // 10.3+

  // Map & Feature Service Formats
  CSV = "csv",
  EXCEL = "excel",
  FEATURE_COLLECTION = "featureCollection",
  FILE_GDB = "filegdb",
  GEOJSON = "geojson",
  GEO_PACKAGE = "geoPackage",
  JSON = "json",
  KML = "kml",
  SHAPEFILE = "shapefile",
  SQLITE = "sqlite",
}
