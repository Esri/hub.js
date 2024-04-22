import * as eventsAPI from "../../../src/events/api";
import { eventAttendeeToSearchResult } from "../../../src/events/api/utils/search";
import * as hubSearchEventAttendees from "../../../src/search/_internal/hubSearchEventAttendees";
import { IQuery } from "../../../src/search/types/IHubCatalog";
import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import response from "./mocks/getRegistrationsResponse";

describe("hubSearchEventAttendees", () => {
  describe("processGetRegistrationsParams", () => {
    fit("processes all properties correctly", () => {
      const qry: IQuery = {
        targetEntity: "eventAttendee",
        properties: {
          eventId: "an event id",
        },
        filters: [
          {
            predicates: [{ term: "abc" }],
          },
          {
            operation: "OR",
            predicates: [
              { role: "owner" },
              { role: "organizer" },
              { role: "attendee" },
            ],
          },
          {
            operation: "OR",
            predicates: [
              { status: "pending" },
              { status: "accepted" },
              { status: "declined" },
              { status: "blocked" },
            ],
          },
          {
            operation: "OR",
            predicates: [
              { attendanceType: "virtual" },
              { attendanceType: "in_person" },
            ],
          },
          {
            operation: "OR",
            predicates: [
              {
                updatedRange: {
                  from: 1714276800000,
                  to: 1714363199999,
                },
              },
            ],
          },
        ],
        collection: "eventAttendees",
      };
      const opts: IHubSearchOptions = {
        num: 10,
        start: 5,
        sortField: "createdAt",
        sortOrder: "desc",
        aggFields: ["this", "should not", "appear"],
      };
      const result = hubSearchEventAttendees.processGetRegistrationsParams(
        opts,
        qry
      );
      expect(result).toEqual({
        num: "10",
        start: "5",
        sortBy: eventsAPI.RegistrationSort.createdAt,
        sortOrder: eventsAPI.SortOrder.desc,
        eventId: "an event id",
        role: "owner,organizer,attendee",
        status: "pending,accepted,declined,blocked",
        type: "virtual,in_person",
        updatedAtBefore: "2024-04-29T03:59:59.999Z",
        updatedAtAfter: "2024-04-28T04:00:00.000Z",
      });
    });
  });

  // describe("eventAttendeesToHubSearchResults", () => {
  //   it("converts attendees to search results", async () => {
  //     const qry: IQuery = {
  //       targetEntity: "eventAttendees",
  //       filters: [],
  //     };
  //     const opts: IHubSearchOptions = {};
  //     const result =
  //       await hubSearchEventAttendees.eventAttendeesToHubSearchResults(
  //         response,
  //         qry,
  //         opts
  //       );
  //     expect(result.total).toEqual(1);
  //     expect(result.results).toEqual([
  //       eventAttendeeToSearchResult(response.items[0]),
  //     ]);
  //     expect(result.hasNext).toBeFalsy();
  //   });
  // });

  // describe('hubSearchEventAttendees', () => {
  //   it(('searches for event attendees'), async () => {
  //     const processGetRegistrationsParamsSpy = spyOn(
  //       hubSearchEventAttendees,
  //       "processGetRegistrationsParams"
  //     ).and.callThrough();
  //     const eventAttendeesToHubSearchResultsSpy = spyOn(
  //       hubSearchEventAttendees,
  //       "eventAttendeesToHubSearchResults"
  //     ).and.callThrough();
  //     const getRegistrationsSpy = spyOn(eventsAPI, "getRegistrations").and.callFake(() => {
  //       return Promise.resolve(response);
  //     });
  //     const qry: IQuery = {
  //       targetEntity: "eventAttendees",
  //       filters: []
  //     };
  //     const opts: IHubSearchOptions = {};
  //     const result = await hubSearchEventAttendees.hubSearchEventAttendees(qry, opts);
  //     //expect(result).toEqual({});
  //   });
  // });
});
