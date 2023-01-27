import { IArcGISContext } from "../ArcGISContext";
import { IVersionMetadata } from "./types";

/**
 * Return an array containing the versions of the item
 * @param id
 * @param context
 * @returns
 */
export async function searchVersions(
  id: string,
  context: IArcGISContext
): Promise<IVersionMetadata[]> {
  throw new Error("not implemented");
}
