import {
  GetRegistrationsParams,
  RegistrationSort,
  EventSortOrder,
} from "../../../events/api/types";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";

export function processAttendeeOptions(
  options: IHubSearchOptions
): Partial<GetRegistrationsParams> {
  const processedOptions: Partial<GetRegistrationsParams> = {};
  if (options.num > 0) {
    processedOptions.num = options.num.toString();
  }
  if (options.start > 1) {
    processedOptions.start = options.start.toString();
  }
  if (options.sortField === "modified") {
    processedOptions.sortBy = RegistrationSort.updatedAt;
  } else if (options.sortField === "created") {
    processedOptions.sortBy = RegistrationSort.createdAt;
  } else if (options.sortField === "username") {
    processedOptions.sortBy = RegistrationSort.username;
  } else if (options.sortField === "firstName") {
    processedOptions.sortBy = RegistrationSort.firstName;
  } else if (options.sortField === "lastName") {
    processedOptions.sortBy = RegistrationSort.lastName;
  }
  processedOptions.sortOrder =
    options.sortOrder === "desc" ? EventSortOrder.desc : EventSortOrder.asc;
  return processedOptions;
}
