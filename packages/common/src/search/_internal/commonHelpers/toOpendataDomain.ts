export function toOpendataDomain(umbrellaDomain: string): string {
  const domainMap: Record<string, string> = {
    "hubdev.arcgis.com": "opendatadev.arcgis.com",
    "hubqa.arcgis.com": "opendataqa.arcgis.com",
    "hub.arcgis.com": "opendata.arcgis.com",
  };
  return domainMap[umbrellaDomain];
}
