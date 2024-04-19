import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import {
  EventSort,
  GetEventsParams,
  SortOrder,
} from "../../../events/api/orval/api/orval-events";

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
  if (EventSort[options.sortField as EventSort]) {
    processedOptions.sortBy = options.sortField as EventSort;
  }
  if (SortOrder[options.sortOrder as SortOrder]) {
    processedOptions.sortOrder = options.sortOrder as SortOrder;
  }
  return processedOptions;
}
