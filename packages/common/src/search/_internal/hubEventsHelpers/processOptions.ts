import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import {
  EventSort,
  ISearchEvents,
  EventSortOrder,
} from "../../../events/api/orval/api/orval-events";

/**
 * Builds a Partial<ISearchEvents> for the given IHubSearchOptions
 * @param options An IHubSearchOptions object
 * @returns a Partial<ISearchEvents> for the given IHubSearchOptions
 */
export function processOptions(
  options: IHubSearchOptions
): Partial<ISearchEvents> {
  const processedOptions: Partial<ISearchEvents> = {};
  if (options.num > 0) {
    processedOptions.num = options.num;
  }
  if (options.start > 1) {
    processedOptions.start = options.start;
  }
  if (options.sortField === "modified") {
    processedOptions.sortBy = EventSort.updatedAt;
  } else if (options.sortField === "created") {
    processedOptions.sortBy = EventSort.createdAt;
  } else if (options.sortField === "title") {
    processedOptions.sortBy = EventSort.title;
  } else if (options.sortField === "startDate") {
    processedOptions.sortBy = EventSort.startDateTime;
  }
  processedOptions.sortOrder =
    options.sortOrder === "desc" ? EventSortOrder.desc : EventSortOrder.asc;
  return processedOptions;
}
