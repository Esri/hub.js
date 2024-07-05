import { IItem } from "@esri/arcgis-rest-portal";
import { IHubSchedule } from "../../core/types/IHubSchedule";
import { getSchedule, isDownloadSchedulingAvailable } from "../manageSchedule";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubRequestOptions } from "../../types";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

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
