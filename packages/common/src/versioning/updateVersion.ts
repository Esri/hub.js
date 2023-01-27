import { IArcGISContext } from "../ArcGISContext";
import { IHubItemEntity } from "../core";
// import { IItem } from "@esri/arcgis-rest-portal";
import { IVersion } from "./types";

/**
 * Return an array containing the versions of the item
 * @param entity
 * @param versionId
 * @param context
 * @returns
 */
export async function updateVersion(
  entity: IHubItemEntity,
  version: IVersion,
  context: IArcGISContext
): Promise<IVersion> {
  throw new Error("not implemented");
}
