import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { getItemStatus } from "@esri/arcgis-rest-portal";

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Helper function which takes an itemId and checks the status
 * of the item every 2 seconds until it is either complete or failed.
 *
 * @export
 * @param {string} itemId AGO item id
 * @param {IUserRequestOptions} requestOptions
 */
export async function _waitForItemReady(
  itemId: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  do {
    await delay(2000);

    const statusResult = await getItemStatus({
      id: itemId,
      ...requestOptions,
    });

    if (statusResult.status === "completed") {
      break;
    } else if (statusResult.status === "failed") {
      throw new Error(statusResult.statusMessage);
    }
  } while (true);
}
