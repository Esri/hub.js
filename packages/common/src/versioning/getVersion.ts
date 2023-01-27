import { IArcGISContext } from "../ArcGISContext";
import { IVersion } from "./types";

/**
 * Return an array containing the versions of the item
 * @param id
 * @param versionId
 * @param context
 * @returns
 */
export async function getVersion(
  id: string,
  versionId: string,
  context: IArcGISContext
): Promise<IVersion> {
  throw new Error("not implemented");
}
