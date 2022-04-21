import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { getItemStatus } from "@esri/arcgis-rest-portal";

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function _waitForItemReady(
  itemId: string,
  requestOptions: IUserRequestOptions
) {
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
