import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { updateItemResource } from "@esri/arcgis-rest-portal";
import HubError from "../HubError";
import { objectToJsonBlob, stringToBlob } from "../resources";
import { getPortalApiUrl } from "../urls";

/**
 * Given an item, and owner, update a given resource to the item and returns its url
 *
 * @export
 * @param {string} id
 * @param {string} owner
 * @param {*} resource
 * @param {string} name
 * @param {IUserRequestOptions} ro
 * @param {string} [prefix=""]
 * @return {*}  {Promise<string>}
 */
export async function updateResource(
  id: string,
  owner: string,
  resource: any,
  name: string,
  ro: IUserRequestOptions,
  prefix: string = ""
): Promise<string> {
  try {
    // Convert resource if needed
    const extension = name.split(".").pop();
    const resourceToUpload =
      // If a json object, convert to blob
      extension === "json"
        ? objectToJsonBlob(resource)
        : // If a string, convert to blob
        extension === "txt"
        ? stringToBlob(resource)
        : // Otherwise, assume it's a blob
          resource;
    // Add item resource
    const response = await updateItemResource({
      id,
      owner,
      resource: resourceToUpload,
      name,
      prefix,
      ...ro,
    });
    // if err throw
    if (!response.success) {
      throw new HubError(
        "Update Item Resource",
        `Error updating resource ${name} to item ${id}.`
      );
    }
    // return url
    const portalRestUrl = getPortalApiUrl(ro.portal);
    if (prefix) {
      prefix = `${prefix}/`;
    }
    return `${portalRestUrl}/content/items/${id}/resources/${prefix}${name}`;
  } catch (err) {
    if (err instanceof Error) {
      throw new HubError("Update Item Resource", err.message, err);
    } else {
      throw new HubError(
        "Update Item Resource",
        `Error updating resource ${name} to item ${id}.`
      );
    }
  }
}
