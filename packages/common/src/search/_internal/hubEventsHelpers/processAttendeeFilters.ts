import {
  EventAttendanceType,
  GetRegistrationsParams,
  RegistrationRole,
  RegistrationStatus,
} from "../../../events/api/types";
import { IQuery } from "../../types";
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

  const term = getPredicateValuesByKey(query.filters, "term");
  if (term.length) {
    // TODO: remove ts-ignore once GetEventsParams supports filtering by username, firstName, lastName https://devtopia.esri.com/dc/hub/issues/10153
    // @ts-ignore
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

  const updatedDateRange = getPredicateValuesByKey(
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
