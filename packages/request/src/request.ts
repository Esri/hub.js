import { request } from "@esri/arcgis-rest-request";

/**
 * One small step for Hub, one large leap for hubkind
 *
 * @returns A Promise that will resolve with the data from the Hub response.
 */
export function helloHub(): Promise<any> {
  const url = "http://sampleserver6.arcgisonline.com/arcgis/rest/services";
  return request(url);
}