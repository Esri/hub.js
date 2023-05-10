export function isOpendataDomain(hostname: string) {
  return [
    "opendatadev.arcgis.com",
    "opendataqa.arcgis.com",
    "opendataqa.arcgis.com",
  ].includes(hostname);
}
