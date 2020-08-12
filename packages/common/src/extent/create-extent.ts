import { IExtent } from "@esri/arcgis-rest-types";

export function createExtent(
  xmin: number,
  ymin: number,
  xmax: number,
  ymax: number,
  wkid: number = 4326
): IExtent {
  return {
    xmin,
    ymin,
    xmax,
    ymax,
    // type: 'extent',
    spatialReference: {
      wkid
    }
  };
}
