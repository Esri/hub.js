import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { addItemResource } from "@esri/arcgis-rest-portal";
import HubError from "../HubError";
import { objectToJsonBlob, stringToBlob } from "../resources";
import { getPortalApiUrl } from "../urls";

/**
 * Given an item, and owner, add a resource to the item and returns its url
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
export async function addResource(
  id: string,
  owner: string,
  resource: any,
  name: string,
  ro: IUserRequestOptions,
  prefix: string = ""
): Promise<string> {
  try {
    let resourceToUpload = resource;
    const extension = name.split(".").pop();

    // JSON and text resources have....odd things happen
    // to them when they are added as resources and NOT
    // converted to blobs. Thus we convert them to blobs
    if (extension === "json") {
      resourceToUpload = objectToJsonBlob(resource);
    }
    if (extension === "txt") {
      resourceToUpload = stringToBlob(resource);
    }
    // Add item resource
    const response = await addItemResource({
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
        "Add Item Resource",
        `Error adding resource ${name} to item ${id}.`
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
      throw new HubError("Add Item Resource", err.message, err);
    } else {
      throw new HubError(
        "Add Item Resource",
        `Error adding resource ${name} to item ${id}.`
      );
    }
  }
}
