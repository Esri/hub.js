import * as eventsAPI from "../../../src/events/api";
import { eventAttendeeToSearchResult } from "../../../src/events/api/utils/search";
import * as hubSearchEventAttendees from "../../../src/search/_internal/hubSearchEventAttendees";
import { IQuery } from "../../../src/search/types/IHubCatalog";
import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import response from "./mocks/getRegistrationsResponse";

describe("hubSearchEventAttendees", () => {
  describe("processGetRegistrationsParams", () => {
    it("processes all properties correctly", () => {
      const qry: IQuery = {
        targetEntity: "eventAttendees",
        filters: [
          {
            predicates: [
              {
                eventId: "an event id",
                userId: "a user id",
                role: "a,registration,role",
                status: "a,registration,status",
                type: "a,registration,type",
                updatedAtBefore: "2024-04-17T15:30:42+0000",
                updatedAtAfter: "2024-04-17T15:30:42+0000",
                aFakeKey: "fake and bad",
              },
            ],
          },
        ],
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
        userId: "a user id",
        role: "a,registration,role",
        status: "a,registration,status",
        type: "a,registration,type",
        updatedAtBefore: "2024-04-17T15:30:42+0000",
        updatedAtAfter: "2024-04-17T15:30:42+0000",
      });
    });
  });

  describe("eventAttendeesToHubSearchResults", () => {
    it("converts attendees to search results", async () => {
      const qry: IQuery = {
        targetEntity: "eventAttendees",
        filters: [],
      };
      const opts: IHubSearchOptions = {};
      const result =
        await hubSearchEventAttendees.eventAttendeesToHubSearchResults(
          response,
          qry,
          opts
        );
      expect(result.total).toEqual(1);
      expect(result.results).toEqual([
        eventAttendeeToSearchResult(response.items[0]),
      ]);
      expect(result.hasNext).toBeFalsy();
    });
  });

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
