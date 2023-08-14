import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { updateGroup } from "@esri/arcgis-rest-portal";
import HubError from "../HubError";

/**
 * Upload a file to be used as the thumbnail for a group
 * @param id
 * @param file
 * @param filename
 * @param requestOptions
 */
export async function setGroupThumbnail(
  id: string,
  file: any,
  filename: string,
  requestOptions: IUserRequestOptions,
  owner: string
): Promise<void> {
  const opts = {
    group: {
      id,
    },
    owner,
    params: {
      thumbnail: file,
      fileName: filename,
    },
    filename,
    ...requestOptions,
  };
  try {
    const response = await updateGroup(opts);
    if (!response.success) {
      throw new HubError(
        "Set Group Thumbnail",
        "Unknown error setting thumbnail."
      );
    }
  } catch (err) {
    if (err instanceof Error) {
      throw new HubError("Set Group Thumbnail", err.message, err);
    } else {
      throw new HubError(
        "Set Group Thumbnail",
        "Unknown error setting thumbnail."
      );
    }
  }
}
