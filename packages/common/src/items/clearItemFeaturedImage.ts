import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { removeItemResource } from "@esri/arcgis-rest-portal";
import HubError from "../HubError";

/**
 * Given an item, and owner, remove a reource from the item
 * @param id
 * @param owner
 * @param filename
 * @param ro
 */
export async function clearItemFeaturedImage(
  id: string,
  owner: string,
  filename: string,
  ro: IUserRequestOptions
): Promise<void> {
  let response;
  try {
    response = await removeItemResource({
      id,
      owner,
      resource: filename,
      ...ro,
    });
    if (response && !response.success) {
      throw new HubError(
        "Clear Item Featured Image",
        "Unknown error clearing featured image."
      );
    }
  } catch (err) {
    if (err instanceof Error) {
      throw new HubError("Clear Item Featured Image", err.message, err);
    } else {
      throw new HubError(
        "Clear Item Featured Image",
        "Unknown error clearing featured image."
      );
    }
  }
}
