import * as eventsAPI from "../../../src/events/api/registrations";
import {
  EventAttendanceType,
  GetRegistrationsParams,
  IPagedRegistrationResponse,
  IRegistration,
  RegistrationRole,
  RegistrationStatus,
} from "../../../src/events/api/types";
import * as eventAttendeeToSearchResultModule from "../../../src/search/_internal/hubEventsHelpers/eventAttendeeToSearchResult";
import { IQuery } from "../../../src/search/types/IHubCatalog";
import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import * as processFiltersModule from "../../../src/search/_internal/hubEventsHelpers/processAttendeeFilters";
import * as processOptionsModule from "../../../src/search/_internal/hubEventsHelpers/processAttendeeOptions";
import { IHubSearchResult } from "../../../src/search/types/IHubSearchResult";
import { hubSearchEventAttendees } from "../../../src/search/_internal/hubSearchEventAttendees";

describe("hubSearchEventAttendees", () => {
  describe("hubSearchEventAttendees", () => {
    const PAGE_1: IPagedRegistrationResponse = {
      items: [
        {
          createdAt: "2024-04-19T12:15:07.222Z",
          createdById: "t_miller",
          eventId: "event1Id",
          id: "52123",
          permission: {
            canDelete: false,
            canEdit: false,
          },
          role: RegistrationRole.ATTENDEE,
          status: RegistrationStatus.ACCEPTED,
          type: EventAttendanceType.IN_PERSON,
          updatedAt: "2024-04-19T12:15:07.222Z",
          userId: "a_brown",
        },
        {
          createdAt: "2024-04-21T11:15:07.222Z",
          createdById: "t_miller",
          eventId: "event2Id",
          id: "52124",
          permission: {
            canDelete: false,
            canEdit: false,
          },
          role: RegistrationRole.ATTENDEE,
          status: RegistrationStatus.ACCEPTED,
          type: EventAttendanceType.VIRTUAL,
          updatedAt: "2024-04-21T11:15:07.222Z",
          userId: "b_arnold",
        },
      ],
      nextStart: 3,
      total: 4,
    };

    const PAGE_2: IPagedRegistrationResponse = {
      items: [
        {
          createdAt: "2024-06-21T11:15:07.222Z",
          createdById: "c_boyd",
          eventId: "event3Id",
          id: "52125",
          permission: {
            canDelete: false,
            canEdit: false,
          },
          role: RegistrationRole.ATTENDEE,
          status: RegistrationStatus.ACCEPTED,
          type: EventAttendanceType.VIRTUAL,
          updatedAt: "2024-06-21T11:15:07.222Z",
          userId: "c_boyd",
        },
        {
          createdAt: "2024-07-21T11:15:07.222Z",
          createdById: "a_burns",
          eventId: "event3Id",
          id: "52126",
          permission: {
            canDelete: false,
            canEdit: false,
          },
          role: RegistrationRole.ATTENDEE,
          status: RegistrationStatus.ACCEPTED,
          type: EventAttendanceType.IN_PERSON,
          updatedAt: "2024-07-21T11:15:07.222Z",
          userId: "a_burns",
        },
      ],
      nextStart: -1,
      total: 4,
    };

    const query: IQuery = {
      query: true,
      filters: [{ predicates: [{ predicate: true }] }],
    } as unknown as IQuery;
    const options = {
      options: true,
      requestOptions: { requestOptions: true },
    } as unknown as IHubSearchOptions;
    const options2 = {
      options: true,
      start: PAGE_1.nextStart,
      requestOptions: { requestOptions: true },
    } as unknown as IHubSearchOptions;
    const processedFilters = {
      processedFilters: true,
    } as unknown as Partial<GetRegistrationsParams>;
    const processedOptions = {
      processedOptions: true,
    } as unknown as Partial<GetRegistrationsParams>;
    const processedOptions2 = {
      processedOptions: true,
      start: PAGE_1.nextStart,
    } as unknown as Partial<GetRegistrationsParams>;
    let getRegistrationsSpy: jasmine.Spy;
    let processAttendeeFiltersSpy: jasmine.Spy;
    let processAttendeeOptionsSpy: jasmine.Spy;
    let eventAttendeeToSearchResultSpy: jasmine.Spy;

    beforeEach(() => {
      getRegistrationsSpy = spyOn(
        eventsAPI,
        "getRegistrations"
      ).and.returnValues(Promise.resolve(PAGE_1), Promise.resolve(PAGE_2));
      processAttendeeFiltersSpy = spyOn(
        processFiltersModule,
        "processAttendeeFilters"
      ).and.returnValue(processedFilters);
      processAttendeeOptionsSpy = spyOn(
        processOptionsModule,
        "processAttendeeOptions"
      ).and.returnValues(processedOptions, processedOptions2);
      eventAttendeeToSearchResultSpy = spyOn(
        eventAttendeeToSearchResultModule,
        "eventAttendeeToSearchResult"
      ).and.callFake((attendee: IRegistration, _options: IHubSearchOptions) =>
        Promise.resolve({ id: attendee.id.toString() } as IHubSearchResult)
      );
    });

    it("should call getRegistrations and resolve with an IHubSearchResponse<IHubSearchResult>", async () => {
      const response = await hubSearchEventAttendees(query, options);
      expect(processAttendeeFiltersSpy).toHaveBeenCalledTimes(1);
      expect(processAttendeeFiltersSpy).toHaveBeenCalledWith(query);
      expect(processAttendeeOptionsSpy).toHaveBeenCalledTimes(1);
      expect(processAttendeeOptionsSpy).toHaveBeenCalledWith(options);
      expect(getRegistrationsSpy).toHaveBeenCalledTimes(1);
      expect(getRegistrationsSpy).toHaveBeenCalledWith({
        ...options.requestOptions,
        data: {
          ...processedFilters,
          ...processedOptions,
        },
      });
      expect(eventAttendeeToSearchResultSpy).toHaveBeenCalledTimes(2);
      expect(eventAttendeeToSearchResultSpy).toHaveBeenCalledWith(
        PAGE_1.items[0],
        options
      );
      expect(eventAttendeeToSearchResultSpy).toHaveBeenCalledWith(
        PAGE_1.items[1],
        options
      );
      expect(response).toEqual(
        {
          total: PAGE_1.total,
          results: [
            { id: PAGE_1.items[0].id.toString() },
            { id: PAGE_1.items[1].id.toString() },
          ] as unknown as IHubSearchResult[],
          hasNext: true,
          next: jasmine.any(Function),
        },
        "response"
      );

      // verify fetches next page of results
      const results2 = await response.next();
      expect(processAttendeeFiltersSpy).toHaveBeenCalledTimes(2);
      expect(processAttendeeFiltersSpy.calls.argsFor(1)).toEqual(
        [query],
        "processFiltersSpy.calls.argsFor(1)"
      );
      expect(processAttendeeOptionsSpy).toHaveBeenCalledTimes(2);
      expect(processAttendeeOptionsSpy.calls.argsFor(1)).toEqual(
        [options2],
        "processOptionsSpy.calls.argsFor(1)"
      );
      expect(getRegistrationsSpy).toHaveBeenCalledTimes(2);
      expect(getRegistrationsSpy.calls.argsFor(1)).toEqual([
        {
          ...options2.requestOptions,
          data: {
            ...processedFilters,
            ...processedOptions2,
          },
        },
      ]);
      expect(eventAttendeeToSearchResultSpy).toHaveBeenCalledTimes(4);
      expect(eventAttendeeToSearchResultSpy.calls.argsFor(2)).toEqual(
        [PAGE_2.items[0], options2],
        "eventToSearchResultSpy.calls.argsFor(0)"
      );
      expect(eventAttendeeToSearchResultSpy.calls.argsFor(3)).toEqual(
        [PAGE_2.items[1], options2],
        "eventToSearchResultSpy.calls.argsFor(0)"
      );
      expect(results2).toEqual(
        {
          total: PAGE_2.total,
          results: [
            { id: PAGE_2.items[0].id.toString() },
            { id: PAGE_2.items[1].id.toString() },
          ] as unknown as IHubSearchResult[],
          hasNext: false,
          next: jasmine.any(Function),
        },
        "results2"
      );

      // verify throws when no more results
      try {
        await results2.next();
        fail("did not reject");
      } catch (e) {
        expect(1).toEqual(2);
        // expect(e.message).toEqual(
        //  "No more hub events for the given query and options"
        // );
      }
    });
  });
});
