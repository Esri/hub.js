import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getHubApiUrl } from "../api";
import { IItem } from "@esri/arcgis-rest-portal";
import { ISchedule } from "../core/types/ISchedule";

export const getSchedule = async (
  item: IItem,
  requestOptions: IRequestOptions
): Promise<ISchedule | null> => {
  const fetchResponse = await fetch(
    `${getHubApiUrl(requestOptions)}/api/download/v1/items/${item.id}/schedule`
  );
  return fetchResponse.ok ? await fetchResponse.json() : null;
};
