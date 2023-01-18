import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { updateItem } from "@esri/arcgis-rest-portal";
import HubError from "../HubError";

/**
 * Upload a file to be used as the thumbnail for an item
 * @param id
 * @param file
 * @param filename
 * @param requestOptions
 */
export async function setItemThumbnail(
  id: string,
  file: any,
  filename: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  const opts = {
    item: {
      id,
    },
    params: {
      thumbnail: file,
      fileName: filename,
    },
    filename,
    ...requestOptions,
  };
  try {
    const response = await updateItem(opts);
    if (!response.success) {
      throw new HubError(
        "Set Project Thumbnail",
        "Unknown error setting thumbnail."
      );
    }
  } catch (err) {
    if (err instanceof Error) {
      throw new HubError("Set Project Thumbnail", err.message, err);
    } else {
      throw new HubError(
        "Set Project Thumbnail",
        "Unknown error setting thumbnail."
      );
    }
  }
}
