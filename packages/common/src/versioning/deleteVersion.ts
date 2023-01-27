import { IArcGISContext } from "../ArcGISContext";

/**
 * Return an array containing the versions of the item
 * @param id
 * @param versionId
 * @param owner
 * @param context
 * @returns
 */
export async function deleteVersion(
  id: string,
  versionId: string,
  owner: string,
  context: IArcGISContext
): Promise<void> {
  throw new Error("not implemented");
}
