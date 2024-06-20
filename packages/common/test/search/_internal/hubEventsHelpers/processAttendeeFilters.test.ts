import { processAttendeeFilters } from "../../../../src/search/_internal/hubEventsHelpers/processAttendeeFilters";
import { IFilter } from "../../../../src/search/types/IHubCatalog";

const FILTERS: IFilter[] = [
  {
    predicates: [
      {
        term: "abc",
      },
    ],
  },
  {
    predicates: [
      {
        userId: "user1",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        role: "owner",
      },
      {
        role: "organizer",
      },
      {
        role: "attendee",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        status: "pending",
      },
      {
        status: "accepted",
      },
      {
        status: "declined",
      },
      {
        status: "blocked",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        attendanceType: "virtual",
      },
      {
        attendanceType: "in_person",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        updatedDateRange: {
          from: 1714276800000,
          to: 1714363199999,
        },
      },
    ],
  },
];

describe("processAttendeeFilters", () => {
  it("should process filters", () => {
    const results = processAttendeeFilters({
      targetEntity: "eventAttendee",
      filters: FILTERS,
      properties: {
        eventId: "an event id",
      },
    });
    expect(results).toEqual({
      eventId: "an event id",
      userId: "u",
      // @ts-ignore
      name: "abc",
      role: "owner,organizer,attendee",
      type: "virtual,in_person",
      status: "pending,accepted,declined,blocked",
      updatedAtAfter: "2024-04-28T04:00:00.000Z",
      updatedAtBefore: "2024-04-29T03:59:59.999Z",
    });
  });
  it("should set some defaults", () => {
    const results = processAttendeeFilters({
      targetEntity: "eventAttendee",
      filters: [],
      properties: {
        eventId: "an event id",
      },
    });
    expect(results).toEqual({
      eventId: "an event id",
      role: "owner,organizer,attendee",
      type: "virtual,in_person",
      status: "pending,accepted,declined,blocked",
    });
  });
});
