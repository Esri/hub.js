import type { IUserRequestOptions } from "@esri/arcgis-rest-request";
import { addItemResource, updateItemResource } from "@esri/arcgis-rest-portal";
import HubError from "../HubError";
import { getPortalApiUrl } from "../urls/get-portal-api-url";
import { doesResourceExist } from "./doesResourceExist";
import { objectToJsonBlob } from "./object-to-json-blob";
import { stringToBlob } from "./string-to-blob";

/**
 * Given an item, and owner, Search for if the resource exists
 * and if does, update it, otherwise add it. Returns a url for the item.
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
export async function upsertResource(
  id: string,
  owner: string,
  resource: any,
  name: string,
  ro: IUserRequestOptions,
  prefix = ""
): Promise<string> {
  try {
    const extension = name.split(".").pop();
    // Search against the item resources to see if the resource exists
    const doesResExist: boolean = await doesResourceExist(id, name, ro);
    // if the resource exists, update it, otherwise add it
    const resourceFunc = doesResExist ? updateItemResource : addItemResource;
    // JSON and text resources have....odd things happen
    // to them when they are added as resources and NOT
    // converted to blobs. Thus we convert them to blobs
    let resourceToUpload = resource;
    if (extension === "json") {
      resourceToUpload = objectToJsonBlob(resource);
    }
    if (extension === "txt") {
      resourceToUpload = stringToBlob(resource);
    }
    // Add item resource
    const response = await resourceFunc({
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
    const _prefix = prefix ? `${prefix}/` : "";

    return `${portalRestUrl}/content/items/${id}/resources/${_prefix}${name}`;
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
