import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getHubApiUrl } from "../api";
import { IItem } from "@esri/arcgis-rest-portal";
import { IHubSchedule } from "../core/types/IHubSchedule";
import { cloneObject } from "../util";
import { IHubRequestOptions } from "../types";

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
  // enterprise check
  if (isPortal(requestOptions)) {
    return null;
  }

  const fetchResponse = await fetch(schedulerApiUrl(item, requestOptions));
  if (!fetchResponse.ok) {
    return null;
  }

  // if the schedule is set, return it with added mode
  const schedule = await fetchResponse.json();
  delete schedule.itemId;
  switch (schedule.cadence) {
    // TODO: add manual option here when option is viable
    case "daily":
    case "weekly":
    case "monthly":
    case "yearly":
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
): Promise<any> => {
  if (isPortal(requestOptions)) {
    return null;
  }

  const body = cloneObject(schedule);
  delete body.mode;
  const url = schedulerApiUrl(item, requestOptions);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      ...body,
      itemId: item.id,
    }),
  };
  const response = await fetch(url, options);
  return response.ok;
};

/**
 * Delete the schedule for an item
 * @param item The item to delete the schedule for
 * @param requestOptions The request options needed to get the HubApiUrl
 */
export const deleteSchedule = async (
  item: IItem,
  requestOptions: IRequestOptions
): Promise<any> => {
  if (isPortal(requestOptions)) {
    return null;
  }
  const url = schedulerApiUrl(item, requestOptions);
  const options = {
    method: "DELETE",
    headers: {
      accept: "application/json",
    },
  };
  const response = await fetch(url, options);
  return response.ok;
};

const isPortal = (requestOptions: IRequestOptions): boolean => {
  return (requestOptions as IHubRequestOptions).isPortal;
};

const schedulerApiUrl = (
  item: IItem,
  requestOptions: IRequestOptions
): string => {
  return `${getHubApiUrl(requestOptions)}/api/download/v1/items/${
    item.id
  }/schedule`;
};
