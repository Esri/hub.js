import { hubSearchEvents } from "../../../src/search/_internal/hubSearchEvents";
import * as processFiltersModule from "../../../src/search/_internal/hubEventsHelpers/processFilters";
import * as processOptionsModule from "../../../src/search/_internal/hubEventsHelpers/processOptions";
import * as eventToSearchResultModule from "../../../src/search/_internal/hubEventsHelpers/eventToSearchResult";
import * as eventsModule from "../../../src/events/api/events";
import {
  EventAccess,
  EventAttendanceType,
  EventStatus,
  GetEventsParams,
  IEvent,
  IPagedEventResponse,
  IUser,
  RegistrationRole,
  RegistrationStatus,
} from "../../../src/events/api/orval/api/orval-events";
import { IQuery } from "../../../src/search/types/IHubCatalog";
import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import { IHubSearchResult } from "../../../src/search/types/IHubSearchResult";

describe("hubSearchEvents", () => {
  const USER_1: IUser = {
    agoId: "user1AgoId",
    createdAt: "2023-06-01T16:00:00.000Z",
    deleted: false,
    email: "user1@esri.com",
    firstName: "John",
    lastName: "Doe",
    optedOut: false,
    updatedAt: "2023-06-01T16:00:00.000Z",
    username: "j_doe",
  };

  const USER_2: IUser = {
    agoId: "user2AgoId",
    createdAt: "2023-05-01T16:00:00.000Z",
    deleted: false,
    email: "user2@esri.com",
    firstName: "Betsy",
    lastName: "Reagan",
    optedOut: false,
    updatedAt: "2023-05-01T16:00:00.000Z",
    username: "b_reagan",
  };

  const USER_3: IUser = {
    agoId: "user3AgoId",
    createdAt: "2023-05-02T16:00:00.000Z",
    deleted: false,
    email: "user3@esri.com",
    firstName: "Kurt",
    lastName: "Florence",
    optedOut: false,
    updatedAt: "2023-05-02T16:00:00.000Z",
    username: "k_florence",
  };

  const PAGE_1: IPagedEventResponse = {
    items: [
      {
        access: EventAccess.PUBLIC,
        allDay: false,
        allowRegistration: true,
        attendanceType: [EventAttendanceType.IN_PERSON],
        categories: ["category1"],
        createdAt: "2024-04-18T20:23:07.149Z",
        createdById: "user1Id",
        creator: USER_1,
        description: "Event 1 description",
        editGroups: ["editGroup1Id"],
        endDateTime: "2040-07-15T18:00:00.000Z",
        endDate: "2040-07-15",
        endTime: "14:00:00",
        id: "event1Id",
        inPersonCapacity: null,
        notifyAttendees: true,
        orgId: "org1Id",
        permission: {
          canDelete: false,
          canEdit: false,
          canSetAccessToOrg: false,
          canSetAccessToPrivate: false,
          canSetAccessToPublic: false,
          canSetStatusToCancelled: false,
          canSetStatusToRemoved: false,
        },
        readGroups: ["readGroup1Id"],
        recurrence: null,
        registrations: [
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
        ],
        startDateTime: "2040-07-15T17:00:00.000Z",
        startDate: "2040-07-15",
        startTime: "13:00:00",
        status: EventStatus.PLANNED,
        summary: "Event 1 summary",
        tags: ["tag1"],
        timeZone: "America/New_York",
        title: "Event 1 title",
        updatedAt: "2024-04-18T20:23:08.000Z",
      },
      {
        access: EventAccess.PUBLIC,
        allDay: false,
        allowRegistration: true,
        attendanceType: [EventAttendanceType.VIRTUAL],
        categories: ["category2"],
        createdAt: "2024-04-19T20:23:07.149Z",
        createdById: "user2Id",
        creator: USER_2,
        description: "Event 2 description",
        editGroups: ["editGroup2Id"],
        endDateTime: "2030-07-15T18:00:00.000Z",
        endDate: "2030-07-15",
        endTime: "11:00:00",
        id: "event2Id",
        inPersonCapacity: null,
        notifyAttendees: true,
        orgId: "org1Id",
        permission: {
          canDelete: false,
          canEdit: false,
          canSetAccessToOrg: false,
          canSetAccessToPrivate: false,
          canSetAccessToPublic: false,
          canSetStatusToCancelled: false,
          canSetStatusToRemoved: false,
        },
        readGroups: ["readGroup2Id"],
        recurrence: null,
        registrations: [
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
        startDateTime: "2030-07-15T17:00:00.000Z",
        startDate: "2030-07-15",
        startTime: "10:00:00",
        status: EventStatus.PLANNED,
        summary: "Event 2 summary",
        tags: ["tag2"],
        timeZone: "America/Los_Angeles",
        title: "Event 2 title",
        updatedAt: "2024-04-19T20:23:07.149Z",
      },
    ],
    nextStart: 3,
    total: 3,
  };

  const PAGE_2: IPagedEventResponse = {
    items: [
      {
        access: EventAccess.PRIVATE,
        allDay: false,
        allowRegistration: true,
        attendanceType: [
          EventAttendanceType.VIRTUAL,
          EventAttendanceType.IN_PERSON,
        ],
        categories: ["category3"],
        createdAt: "2024-02-25T10:10:10.120",
        createdById: "user3Id",
        creator: USER_3,
        description: "Event 3 description",
        editGroups: ["editGroup3Id"],
        endDateTime: "2030-05-15T18:00:00.000Z",
        endDate: "2030-05-15",
        endTime: "12:00:00",
        id: "event3Id",
        inPersonCapacity: null,
        notifyAttendees: true,
        orgId: "org1Id",
        permission: {
          canDelete: false,
          canEdit: false,
          canSetAccessToOrg: false,
          canSetAccessToPrivate: false,
          canSetAccessToPublic: false,
          canSetStatusToCancelled: false,
          canSetStatusToRemoved: false,
        },
        readGroups: ["readGroup3Id"],
        recurrence: null,
        registrations: [
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
        startDateTime: "2030-05-15T16:00:00.000Z",
        startDate: "2030-05-15",
        startTime: "10:00:00",
        status: EventStatus.PLANNED,
        summary: "Event 3 summary",
        tags: ["tag3"],
        timeZone: "America/Denver",
        title: "Event 3 title",
        updatedAt: "2024-02-25T10:10:10.120",
      },
    ],
    nextStart: -1,
    total: 3,
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
  } as unknown as Partial<GetEventsParams>;
  const processedOptions = {
    processedOptions: true,
  } as unknown as Partial<GetEventsParams>;
  const processedOptions2 = {
    processedOptions: true,
    start: PAGE_1.nextStart,
  } as unknown as Partial<GetEventsParams>;
  let getEventsSpy: jasmine.Spy;
  let processFiltersSpy: jasmine.Spy;
  let processOptionsSpy: jasmine.Spy;
  let eventToSearchResultSpy: jasmine.Spy;

  beforeEach(() => {
    getEventsSpy = spyOn(eventsModule, "getEvents").and.returnValues(
      Promise.resolve(PAGE_1),
      Promise.resolve(PAGE_2)
    );
    processFiltersSpy = spyOn(
      processFiltersModule,
      "processFilters"
    ).and.returnValue(processedFilters);
    processOptionsSpy = spyOn(
      processOptionsModule,
      "processOptions"
    ).and.returnValues(processedOptions, processedOptions2);
    eventToSearchResultSpy = spyOn(
      eventToSearchResultModule,
      "eventToSearchResult"
    ).and.callFake((event: IEvent) =>
      Promise.resolve({ id: event.id } as IHubSearchResult)
    );
  });

  it("should call events and resolve with an IHubSearchResponse<IHubSearchResult>", async () => {
    const response = await hubSearchEvents(query, options);
    expect(processFiltersSpy).toHaveBeenCalledTimes(1);
    expect(processFiltersSpy).toHaveBeenCalledWith(query.filters, {
      requestOptions: true,
    });
    expect(processOptionsSpy).toHaveBeenCalledTimes(1);
    expect(processOptionsSpy).toHaveBeenCalledWith(options);
    expect(getEventsSpy).toHaveBeenCalledTimes(1);
    expect(getEventsSpy).toHaveBeenCalledWith({
      ...options.requestOptions,
      data: {
        ...processedFilters,
        ...processedOptions,
        include: "creator,registrations",
      },
    });
    expect(eventToSearchResultSpy).toHaveBeenCalledTimes(2);
    expect(eventToSearchResultSpy).toHaveBeenCalledWith(
      PAGE_1.items[0],
      options
    );
    expect(eventToSearchResultSpy).toHaveBeenCalledWith(
      PAGE_1.items[1],
      options
    );
    expect(response).toEqual(
      {
        total: PAGE_1.total,
        results: [
          { id: PAGE_1.items[0].id },
          { id: PAGE_1.items[1].id },
        ] as unknown as IHubSearchResult[],
        hasNext: true,
        next: jasmine.any(Function),
      },
      "response"
    );

    // verify fetches next page of results
    const results2 = await response.next();
    expect(processFiltersSpy).toHaveBeenCalledTimes(2);
    expect(processFiltersSpy.calls.argsFor(1)).toEqual(
      [query.filters, { requestOptions: true }],
      "processFiltersSpy.calls.argsFor(1)"
    );
    expect(processOptionsSpy).toHaveBeenCalledTimes(2);
    expect(processOptionsSpy.calls.argsFor(1)).toEqual(
      [options2],
      "processOptionsSpy.calls.argsFor(1)"
    );
    expect(getEventsSpy).toHaveBeenCalledTimes(2);
    expect(getEventsSpy.calls.argsFor(1)).toEqual(
      [
        {
          ...options2.requestOptions,
          data: {
            ...processedFilters,
            ...processedOptions2,
            include: "creator,registrations",
          },
        },
      ],
      "getEventsSpy.calls.argsFor(1)"
    );
    expect(eventToSearchResultSpy).toHaveBeenCalledTimes(3);
    expect(eventToSearchResultSpy.calls.argsFor(2)).toEqual(
      [PAGE_2.items[0], options2],
      "eventToSearchResultSpy.calls.argsFor(0)"
    );
    expect(results2).toEqual(
      {
        total: PAGE_2.total,
        results: [{ id: PAGE_2.items[0].id }] as unknown as IHubSearchResult[],
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
      expect(e.message).toEqual(
        "No more hub events for the given query and options"
      );
    }
  });
});
