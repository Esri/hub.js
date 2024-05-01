import * as eventsAPI from "../../../src/events/api/registrations";
import { RegistrationSort, SortOrder } from "../../../src/events/api/types";
import * as searchUtils from "../../../src/events/api/utils/search";
import * as hubSearchEventAttendees from "../../../src/search/_internal/hubSearchEventAttendees";
import { IQuery } from "../../../src/search/types/IHubCatalog";
import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import { registration, user } from "./mocks/getRegistrationsResponse";
import * as arcgisRestPortal from "@esri/arcgis-rest-portal";

describe("hubSearchEventAttendees", () => {
  describe("processIGetRegistrationsParams", () => {
    it("processes all properties correctly", () => {
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
        start: undefined,
        sortField: "createdAt",
        sortOrder: "desc",
        aggFields: ["this", "should not", "appear"],
      };
      const result = hubSearchEventAttendees.processIGetRegistrationsParams(
        opts,
        qry
      );

      expect(result).toEqual({
        data: {
          num: "10",
          sortBy: RegistrationSort.createdAt,
          sortOrder: SortOrder.desc,
          eventId: "an event id",
          role: "owner,organizer,attendee",
          status: "pending,accepted,declined,blocked",
          type: "virtual,in_person",
          updatedAtBefore: "2024-04-29T03:59:59.999Z",
          updatedAtAfter: "2024-04-28T04:00:00.000Z",
        },
      });
    });
  });

  describe("eventAttendeesToHubSearchResults", () => {
    it("converts attendees to search results", async () => {
      spyOn(arcgisRestPortal, "getUser").and.returnValue(user);
      const eventAttendeeToSearchResultSpy = spyOn(
        searchUtils,
        "eventAttendeeToSearchResult"
      ).and.callThrough();
      const hubSearchEventAttendeesSpy = spyOn(
        hubSearchEventAttendees,
        "hubSearchEventAttendees"
      ).and.callFake(() => {
        return Promise.resolve({});
      });
      const qry: IQuery = {
        targetEntity: "eventAttendee",
        filters: [],
        properties: {
          eventId: "an event id",
        },
      };

      const opts: IHubSearchOptions = {};
      const result =
        await hubSearchEventAttendees.eventAttendeesToHubSearchResults(
          registration,
          qry,
          opts
        );

      expect(result.total).toEqual(1);
      expect(eventAttendeeToSearchResultSpy).toHaveBeenCalledWith(
        registration.items[0]
      );
      expect(result.results.length).toEqual(1);
      expect(result.results).toEqual([
        {
          createdAt: "2024-04-17T15:30:42+0000",
          createdById: "a creator id",
          eventId: "an event id",
          id: "0",
          permission: Object({ canDelete: true, canEdit: true }),
          role: "OWNER",
          status: "PENDING",
          type: "Event Attendee",
          updatedAt: "2024-04-17T15:30:42+0000",
          userId: "a user id",
          name: "John Green",
          createdDate: new Date(
            "Wed Apr 17 2024 11:30:42 GMT-0400 (Eastern Daylight Time)"
          ),
          createdDateSource: "attendee.createdAt",
          updatedDate: new Date(
            "Wed Apr 17 2024 11:30:42 GMT-0400 (Eastern Daylight Time)"
          ),
          updatedDateSource: "attendee.updatedAt",
          access: "private",
          family: "eventAttendees",
          rawResult: registration.items[0],
        },
      ]);
      expect(result.hasNext).toBeFalsy();
      const nextResult = await result.next();
      expect(nextResult).toBeTruthy();
    });
  });

  describe("hubSearchEventAttendees", () => {
    it("searches for event attendees", async () => {
      spyOn(arcgisRestPortal, "getUser").and.returnValue(user);
      const processIGetRegistrationsParamsSpy = spyOn(
        hubSearchEventAttendees,
        "processIGetRegistrationsParams"
      ).and.callThrough();
      const getRegistrationsSpy = spyOn(
        eventsAPI,
        "getRegistrations"
      ).and.callFake(() => {
        return Promise.resolve(registration);
      });
      const eventAttendeesToHubSearchResultsSpy = spyOn(
        hubSearchEventAttendees,
        "eventAttendeesToHubSearchResults"
      ).and.callThrough();

      const qry: IQuery = {
        targetEntity: "eventAttendee",
        filters: [],
        properties: {
          eventId: "an event id",
        },
      };
      const opts: IHubSearchOptions = {};
      const result = await hubSearchEventAttendees.hubSearchEventAttendees(
        qry,
        opts
      );

      expect(processIGetRegistrationsParamsSpy).toHaveBeenCalledWith(opts, qry);
      expect(getRegistrationsSpy).toHaveBeenCalledWith({
        data: { eventId: "an event id" },
      });
      expect(eventAttendeesToHubSearchResultsSpy).toHaveBeenCalledWith(
        registration,
        qry,
        opts
      );
      expect(result.total).toEqual(1);
      expect(result.results.length).toEqual(1);
      expect(result.results).toEqual([
        {
          createdAt: "2024-04-17T15:30:42+0000",
          createdById: "a creator id",
          eventId: "an event id",
          id: "0",
          permission: Object({ canDelete: true, canEdit: true }),
          role: "OWNER",
          status: "PENDING",
          type: "Event Attendee",
          updatedAt: "2024-04-17T15:30:42+0000",
          userId: "a user id",
          name: "John Green",
          createdDate: new Date(
            "Wed Apr 17 2024 11:30:42 GMT-0400 (Eastern Daylight Time)"
          ),
          createdDateSource: "attendee.createdAt",
          updatedDate: new Date(
            "Wed Apr 17 2024 11:30:42 GMT-0400 (Eastern Daylight Time)"
          ),
          updatedDateSource: "attendee.updatedAt",
          access: "private",
          family: "eventAttendees",
          rawResult: registration.items[0],
        },
      ]);
      expect(result.hasNext).toBeFalsy();
    });
  });
});
