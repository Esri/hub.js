import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getHubApiUrl } from "../api";
import { IHubSchedule, IHubScheduleResponse } from "../core/types/IHubSchedule";
import { cloneObject } from "../util";
import { deepEqual } from "../objects/deepEqual";
import { AccessLevel, IHubEditableContent } from "../core";

// Any code referencing these functions must first pass isDownloadSchedulingAvailable

/**
 * Get the schedule for an item. If no schedule is found, returns null.
 * @param itemId The item to get the schedule for
 * @param requestOptions The request options needed to get the HubApiUrl
 * @returns The schedule for the item OR null if no schedule is set
 */
export const getSchedule = async (
  itemId: string,
  requestOptions: IRequestOptions
): Promise<IHubScheduleResponse> => {
  const fetchResponse = await fetch(getSchedulerApiUrl(itemId, requestOptions));
  const schedule = await fetchResponse.json();
  if (!fetchResponse.ok || schedule.statusCode === 404) {
    return {
      message: `Download schedule not found for item ${itemId}`,
      statusCode: 404,
      schedule: null,
    } as IHubScheduleResponse;
  }

  // if the schedule is set, return it with added mode
  delete schedule.itemId;
  switch (schedule.cadence) {
    // TODO: add manual option here when option is viable
    case "daily":
    case "weekly":
    case "monthly":
    case "yearly":
      return {
        schedule: {
          ...schedule,
          mode: "scheduled",
        },
        message: `Download schedule found for item ${itemId}`,
        statusCode: 200,
      } as IHubScheduleResponse;
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
): Promise<IHubScheduleResponse> => {
  const body = cloneObject(schedule);
  delete body.mode;
  const url = getSchedulerApiUrl(itemId, requestOptions);
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
  const response = await fetch(url, options);
  return {
    ...((await response.json()) as IHubScheduleResponse),
    statusCode: response.status,
  };
};

/**
 * Delete the schedule for an item
 * @param itemId The item to delete the schedule for
 * @param requestOptions The request options needed to get the HubApiUrl
 */
export const deleteSchedule = async (
  itemId: string,
  requestOptions: IRequestOptions
): Promise<IHubScheduleResponse> => {
  const url = getSchedulerApiUrl(itemId, requestOptions);
  const options = {
    method: "DELETE",
    headers: {
      accept: "application/json",
    },
  };
  const response = await fetch(url, options);
  return {
    ...((await response.json()) as IHubScheduleResponse),
    statusCode: response.status,
  };
};

/**
 * Checks if the content schedule should be updated and updates it if necessary
 * @param content The content to check and update the schedule for (should include any new schedule information)
 * @param requestOptions The request options needed to get the HubApiUrl
 */
export const maybeUpdateSchedule = async (
  content: IHubEditableContent,
  requestOptions: IRequestOptions
): Promise<IHubScheduleResponse> => {
  const scheduleResponse = await getSchedule(content.id, requestOptions);

  // if no schedule is set and incoming schedule is automatic, do nothing
  if (
    content.schedule.mode === "automatic" &&
    scheduleResponse.statusCode === 404
  ) {
    return {
      message: "No schedule set, and incoming schedule is automatic.",
      statusCode: 404,
    };
  }

  if (!deepEqual(content.schedule, scheduleResponse.schedule)) {
    // if current and incoming schedules differ
    if (content.schedule.mode === "automatic") {
      // and incoming schedule is automatic
      return await deleteSchedule(content.id, requestOptions); // delete the schedule
    } else {
      // else
      return await setSchedule(content.id, content.schedule, requestOptions); // set the schedule
    }
  }
  return { message: "No action needed as schedules deepEqual each other." };
};

const getSchedulerApiUrl = (
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
  requestOptions: IRequestOptions,
  access: AccessLevel
): boolean => {
  return requestOptions.portal?.includes("arcgis.com") && access === "public";
};
