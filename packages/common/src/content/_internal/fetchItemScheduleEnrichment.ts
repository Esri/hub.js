import { IItem } from "@esri/arcgis-rest-portal";
import { IHubSchedule } from "../../core/types/IHubSchedule";
import { getSchedule, isDownloadSchedulingAvailable } from "../manageSchedule";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubRequestOptions } from "../../hub-types";
import type { IUserRequestOptions } from "@esri/arcgis-rest-auth";

/**
 * @private
 *
 * Fetches the schedule enrichment for a content item. The enrichment will only be fetched if the item
 * is eligible for download scheduling and the user has permission to view the schedule. In cases
 * where the schedule cannot be fetched, the function will return undefined.
 *
 * @param item
 * @param requestOptions
 * @returns the schedule enrichment or undefined
 */
export async function fetchItemScheduleEnrichment(
  item: IItem,
  requestOptions: IRequestOptions
): Promise<IHubSchedule> {
  let result: IHubSchedule;
  if (
    isDownloadSchedulingAvailable(
      requestOptions as IHubRequestOptions,
      item.access
    )
  ) {
    try {
      // fetch schedule and add it to enrichments if it exists in schedule API
      const { schedule } = await getSchedule(
        item.id,
        requestOptions as IUserRequestOptions
      );
      result = schedule || { mode: "automatic" };
    } catch (error) {
      /* tslint:disable no-console */
      console.warn("Failed to fetch schedule for item", item.id, error);
    }
  }

  return result;
}
