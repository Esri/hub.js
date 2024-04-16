import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getHubApiUrl } from "../api";
import { IItem } from "@esri/arcgis-rest-portal";
import { IHubSchedule } from "../core/types/IHubSchedule";

/**
 * Get the schedule for an item. If no schedule is found, returns null.
 * @param item The item to get the schedule for
 * @param requestOptions The request options needed to get the HubApiUrl
 * @returns The schedule for the item OR null if no schedule is set
 */
export const getSchedule = async (
  item: IItem,
  requestOptions: IRequestOptions
): Promise<IHubSchedule | null> => {
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

/**
 * Set the schedule for an item
 * @param item The item to set the schedule for
 * @param schedule The schedule to set
 * @param requestOptions The request options needed to get the HubApiUrl
 */
export const setSchedule = async (
  item: IItem,
  schedule: IHubSchedule,
  requestOptions: IRequestOptions
): Promise<void> => {
  if (schedule.mode) {
    delete schedule.mode;
  }
  const url = `${getHubApiUrl(requestOptions)}/api/download/v1/items/${
    item.id
  }/schedule`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      ...schedule,
      itemId: item.id,
    }),
  };
  await fetch(url, options);
};

/**
 * Delete the schedule for an item
 * @param item The item to delete the schedule for
 * @param requestOptions The request options needed to get the HubApiUrl
 */
export const deleteSchedule = async (
  item: IItem,
  requestOptions: IRequestOptions
): Promise<void> => {
  const url = `${getHubApiUrl(requestOptions)}/api/download/v1/items/${
    item.id
  }/schedule`;
  const options = {
    method: "DELETE",
    headers: {
      accept: "application/json",
    },
  };
  await fetch(url, options);
};
