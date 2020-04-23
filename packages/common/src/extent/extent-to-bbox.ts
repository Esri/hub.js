import { IExtent } from "@esri/arcgis-rest-types";
import { IBBox } from "../types";

/**
 * Turns an extent into a bbox
 * @param envelope extent
 */
export function extentToBBox(envelope: IExtent): IBBox {
  return [[envelope.xmin, envelope.ymin], [envelope.xmax, envelope.ymax]];
}
