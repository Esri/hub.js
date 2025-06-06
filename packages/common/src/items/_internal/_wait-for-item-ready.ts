import type { IUserRequestOptions } from "@esri/arcgis-rest-request";
import {
  getItemStatus,
  IGetItemStatusResponse,
} from "@esri/arcgis-rest-portal";

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
  requestOptions: IUserRequestOptions,
  milliseconds?: number
): Promise<void> {
  let statusResult: IGetItemStatusResponse;
  do {
    await delay(
      milliseconds || /* istanbul ignore next: slows down tests */ 2000
    );

    statusResult = await getItemStatus({
      id: itemId,
      ...requestOptions,
    });

    if (statusResult.status === "failed") {
      throw new Error(statusResult.statusMessage);
    }
  } while (statusResult.status !== "completed");
}
