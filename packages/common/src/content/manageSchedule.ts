import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getHubApiUrl } from "../api";
import { IItem } from "@esri/arcgis-rest-portal";
import { ISchedule } from "../core/types/ISchedule";

/**
 * Get the schedule for an item. If no schedule is found, returns null.
 * @param item The item to get the schedule for
 * @param requestOptions The request options needed to get the HubApiUrl
 * @returns The schedule for the item OR null if no schedule is set
 */
export const getSchedule = async (
  item: IItem,
  requestOptions: IRequestOptions
): Promise<ISchedule | null> => {
  const fetchResponse = await fetch(
    `${getHubApiUrl(requestOptions)}/api/download/v1/items/${item.id}/schedule`
  );
  if (!fetchResponse.ok) {
    return null;
  }

  // if the schedule is set, return it with added mode
  const schedule = await fetchResponse.json();
  switch (schedule.cadence) {
    case "automatic":
      return {
        mode: "automatic",
      };
    case "manual":
      return {
        mode: "manual",
      };
    case "daily":
    case "weekly":
    case "monthly":
    case "annually":
      return {
        ...schedule,
        mode: "scheduled",
      };
  }
};

// export const setSchedule = async (
//   item: IItem,
//   schedule: ISchedule,
//   requestOptions: IRequestOptions
// ): Promise<void> => {
//   await fetch(
//     `${getHubApiUrl(requestOptions)}/api/download/v1/items/${item.id}/schedule`,
//     {
//       method: "POST",
//       schedule: schedule,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
// }
