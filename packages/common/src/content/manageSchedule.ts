import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getHubApiUrl } from "../api";
import { IHubSchedule } from "../core/types/IHubSchedule";
import { cloneObject } from "../util";
import { deepEqual } from "../objects/deepEqual";
import { IHubEditableContent } from "../core";

// Any code referencing these functions must first pass:
// checkPermission("hub:content:workspace:settings:schedule", _context).access

/**
 * Get the schedule for an item. If no schedule is found, returns null.
 * @param itemId The item to get the schedule for
 * @param requestOptions The request options needed to get the HubApiUrl
 * @returns The schedule for the item OR null if no schedule is set
 */
export const getSchedule = async (
  itemId: string,
  requestOptions: IRequestOptions
): Promise<IHubSchedule | null> => {
  let fetchResponse;
  try {
    fetchResponse = await fetch(schedulerApiUrl(itemId, requestOptions));
  } catch (e) {
    return null;
  }
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
 * @param itemId The item to set the schedule for
 * @param schedule The schedule to set
 * @param requestOptions The request options needed to get the HubApiUrl
 */
export const setSchedule = async (
  itemId: string,
  schedule: IHubSchedule,
  requestOptions: IRequestOptions
): Promise<any> => {
  const body = cloneObject(schedule);
  delete body.mode;
  const url = schedulerApiUrl(itemId, requestOptions);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      ...body,
      itemId,
    }),
  };
  let response;
  try {
    response = await fetch(url, options);
  } catch (e) {
    return false;
  }

  return response.ok;
};

/**
 * Delete the schedule for an item
 * @param itemId The item to delete the schedule for
 * @param requestOptions The request options needed to get the HubApiUrl
 */
export const deleteSchedule = async (
  itemId: string,
  requestOptions: IRequestOptions
): Promise<any> => {
  const url = schedulerApiUrl(itemId, requestOptions);
  const options = {
    method: "DELETE",
    headers: {
      accept: "application/json",
    },
  };
  let response;
  try {
    response = await fetch(url, options);
  } catch (e) {
    return false;
  }

  return response.ok;
};

/**
 * Checks if the content schedule should be updated and updates it if necessary
 * @param content The content to check and update the schedule for (should include any new schedule information)
 * @param requestOptions The request options needed to get the HubApiUrl
 */
export const maybeUpdateSchedule = async (
  content: IHubEditableContent,
  requestOptions: IRequestOptions
) => {
  const currentSchedule = await getSchedule(content.id, requestOptions);

  // if no schedule is set and incoming schedule is automatic, do nothing
  if (content.schedule.mode === "automatic" && content.schedule === null) {
    return false;
  }

  if (!deepEqual(content.schedule, currentSchedule)) {
    // if current and incoming schedules differ
    if (content.schedule.mode === "automatic") {
      // and incoming schedule is automatic
      return await deleteSchedule(content.id, requestOptions); // delete the schedule
    } else {
      // else
      return await setSchedule(content.id, content.schedule, requestOptions); // set the schedule
    }
  }
};

const schedulerApiUrl = (
  itemId: string,
  requestOptions: IRequestOptions
): string => {
  return `${getHubApiUrl(
    requestOptions
  )}/api/download/v1/items/${itemId}/schedule`;
};

/**
 * To be used before calling any of the schedule functions in order to prevent fetch
 * requests to scheduler API from portal/enterprise
 *
 * Note: After a discussion w/ Dave, we decided this check is preferred to passing the context
 * into functions that would need checkPermission
 * @param requestOptions The request options needed to get the HubApiUrl
 * @returns Whether or not the scheduling feature is available
 */
export const isDownloadSchedulingAvailable = (
  requestOptions: IRequestOptions
): boolean => {
  return requestOptions.portal?.includes("arcgis.com");
};
