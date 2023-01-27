import { IArcGISContext } from "../ArcGISContext";
import { IHubItemEntity } from "../core";
// import { IItem } from "@esri/arcgis-rest-portal";
import { ICreateVersionOptions, IVersion } from "./types";

/**
 * Return an array containing the versions of the item
 * @param entity
 * @param context
 * @returns
 */
export async function createVersion(
  entity: IHubItemEntity,
  context: IArcGISContext,
  options: ICreateVersionOptions
): Promise<IVersion> {
  throw new Error("not implemented");
}
