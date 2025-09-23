import {
  EventAttendanceType,
  GetRegistrationsParams,
  RegistrationRole,
  RegistrationStatus,
} from "../../../events/api/types";
import { IQuery } from "../../types/IHubCatalog";
import { IDateRange } from "../../types/types";
import { getOptionalPredicateStringsByKey } from "./getOptionalPredicateStringsByKey";
import { getPredicateValuesByKey } from "./getPredicateValuesByKey";

export function processAttendeeFilters(
  query: IQuery
): Partial<GetRegistrationsParams> {
  const processedFilters: Partial<GetRegistrationsParams> = {
    eventId: query.properties.eventId,
  };
  const useElseJoin = (value: string, defaults: string[]): string =>
    value?.length ? value : defaults.map((val) => val.toLowerCase()).join(",");

  const userId = getOptionalPredicateStringsByKey(query.filters, "userId");
  if (userId?.length) {
    processedFilters.userId = userId;
  }

  const term = getPredicateValuesByKey<string>(query.filters, "term");
  if (term.length) {
    processedFilters.name = term[0];
  }

  processedFilters.type = useElseJoin(
    getOptionalPredicateStringsByKey(query.filters, "attendanceType"),
    [EventAttendanceType.VIRTUAL, EventAttendanceType.IN_PERSON]
  );

  processedFilters.role = useElseJoin(
    getOptionalPredicateStringsByKey(query.filters, "role"),
    [
      RegistrationRole.OWNER,
      RegistrationRole.ORGANIZER,
      RegistrationRole.ATTENDEE,
    ]
  );

  processedFilters.status = useElseJoin(
    getOptionalPredicateStringsByKey(query.filters, "status"),
    [
      RegistrationStatus.PENDING,
      RegistrationStatus.ACCEPTED,
      RegistrationStatus.DECLINED,
      RegistrationStatus.BLOCKED,
    ]
  );

  const updatedDateRange = getPredicateValuesByKey<IDateRange<string | number>>(
    query.filters,
    "updatedDateRange"
  );
  if (updatedDateRange.length) {
    processedFilters.updatedAtBefore = new Date(
      updatedDateRange[0].to
    ).toISOString();
    processedFilters.updatedAtAfter = new Date(
      updatedDateRange[0].from
    ).toISOString();
  }

  return processedFilters;
}
