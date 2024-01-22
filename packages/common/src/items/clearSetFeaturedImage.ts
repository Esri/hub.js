import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IHubInitiative, IHubProject } from "../core";
import { removeItemResource } from "@esri/arcgis-rest-portal";
import HubError from "../HubError";
import { uploadImageResource } from "./uploadImageResource";

const FEATURED_IMAGE_FILENAME = "featuredImage.png";

/**
 * clearSetFeaturedImage clears, sets, or both clears
 * and sets the featured image for a project or initiative.
 *
 * @param file Image file to upload
 * @param clearOrSet Should we clear the image, set the image, or both?
 * @param projectOrInitiative Project/initiative entity
 * @param ro Request options  (authentication)
 * @param filename Optional filename to use for the image resource
 * @returns
 */
export async function clearSetFeaturedImage(
  file: any,
  clearOrSet: "clear" | "set" | "both",
  projectOrInitiative: Partial<IHubProject> | Partial<IHubInitiative>,
  ro: IUserRequestOptions,
  filename: string = FEATURED_IMAGE_FILENAME
): Promise<string | null> {
  let result: string;
  try {
    // Clear Item Resource
    if (clearOrSet === "clear" || clearOrSet === "both") {
      const resp = await removeItemResource({
        id: projectOrInitiative.id,
        owner: projectOrInitiative.owner,
        resource: filename,
        ...ro,
      });
      // if it's not successful, throw an error
      if (resp && !resp.success) {
        throw new HubError(
          "Clear Set Featured Image",
          "Unknown error clearing featured image."
        );
      }
      result = null;
    }
    // Add item resource
    if (clearOrSet === "set" || clearOrSet === "both") {
      const resp = await uploadImageResource(
        projectOrInitiative.id,
        projectOrInitiative.owner,
        file,
        filename,
        ro
      );
      result = resp;
    }
    return result;
  } catch (err) {
    // If the error indicates the item already exists, rerun to try to clear it.
    if (
      err instanceof Error &&
      err.message === "CONT_00942: Resource already present"
    ) {
      return clearSetFeaturedImage(
        file,
        "both",
        projectOrInitiative,
        ro,
        filename
      );
      // Otherwise if the error indicates the resources does NOT exist, rerun to try to set it.
    } else if (
      err instanceof Error &&
      err.message.includes("Resource does not exist or is inaccessible")
    ) {
      // If we are ONLY trying to clear the image, and it doesn't exist, just return null
      if (clearOrSet === "clear") {
        return null;
      } else {
        return clearSetFeaturedImage(
          file,
          "set",
          projectOrInitiative,
          ro,
          filename
        );
      }
    } else {
      throw err;
    }
  }
}
