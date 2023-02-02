import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import {
  addItemResource,
  getItemResources,
  updateItemResource,
} from "@esri/arcgis-rest-portal";
import HubError from "../HubError";
import { objectToJsonBlob, stringToBlob } from ".";
import { getPortalApiUrl } from "../urls";

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
  prefix: string = ""
): Promise<string> {
  try {
    const extension = name.split(".").pop();
    // Search against the item resources to see if the resource exists
    const doesResourceExist: boolean = await getItemResources(id, ro).then(
      (resp) => {
        // if the resource exists, return true
        return resp.resources.find((e: any) => {
          return e.resource === name;
        });
      }
    );
    // if the resource exists, update it, otherwise add it
    const resourceFunc = doesResourceExist
      ? updateItemResource
      : addItemResource;
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
