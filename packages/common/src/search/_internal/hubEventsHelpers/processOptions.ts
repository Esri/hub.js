import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import {
  EventSort,
  GetEventsParams,
  SortOrder,
} from "../../../events/api/orval/api/orval-events";

/**
 * Builds a Partial<GetEventsParams> for the given IHubSearchOptions
 * @param options An IHubSearchOptions object
 * @returns a Partial<GetEventsParams> for the given IHubSearchOptions
 */
export function processOptions(
  options: IHubSearchOptions
): Partial<GetEventsParams> {
  const processedOptions: Partial<GetEventsParams> = {};
  if (options.num > 0) {
    processedOptions.num = options.num.toString();
  }
  if (options.start > 1) {
    processedOptions.start = options.start.toString();
  }
  if (options.sortField === "modified") {
    processedOptions.sortBy = EventSort.updatedAt;
  } else if (options.sortField === "created") {
    processedOptions.sortBy = EventSort.createdAt;
  } else if (options.sortField === "title") {
    processedOptions.sortBy = EventSort.title;
  }
  processedOptions.sortOrder =
    options.sortOrder === "desc" ? SortOrder.desc : SortOrder.asc;
  return processedOptions;
}
