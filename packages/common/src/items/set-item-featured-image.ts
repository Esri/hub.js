import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { addItemResource } from "@esri/arcgis-rest-portal";
import HubError from "../HubError";
import { getPortalApiUrl } from "../urls";

/**
 * Given an item, and owner, add a resource to the item
 * @param id
 * @param owner
 * @param file
 * @param filename
 * @param ro
 * @param prefix
 * @returns
 */
export async function setItemFeaturedImage(
  id: string,
  owner: string,
  file: any,
  filename: string,
  ro: IUserRequestOptions,
  prefix: string = ""
): Promise<string> {
  try {
    // Add item resource
    const response = await addItemResource({
      id,
      owner,
      resource: file,
      name: filename,
      prefix,
      ...ro,
    });
    // if err throw
    if (!response.success) {
      throw new HubError(
        "Set Item Featured Image",
        "Unknown error setting featured image."
      );
    }
    // return url
    const portalRestUrl = getPortalApiUrl(ro.portal);
    if (prefix) {
      prefix = `${prefix}/`;
    }
    return `${portalRestUrl}/content/items/${id}/resources/${prefix}${filename}`;
  } catch (err) {
    if (err instanceof Error) {
      throw new HubError("Set Item Featured Image", err.message, err);
    } else {
      throw new HubError(
        "Set Item Featured Image",
        "Unknown error setting featured image."
      );
    }
  }
}
