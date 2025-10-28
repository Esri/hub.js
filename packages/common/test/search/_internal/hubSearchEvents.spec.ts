import { hubSearchEvents } from "../../../src/search/_internal/hubSearchEvents";
import * as processFiltersModule from "../../../src/search/_internal/hubEventsHelpers/processFilters";
import * as processOptionsModule from "../../../src/search/_internal/hubEventsHelpers/processOptions";
import * as eventToSearchResultModule from "../../../src/search/_internal/hubEventsHelpers/eventToSearchResult";
import * as eventsModule from "../../../src/events/api/events";
import {
  EventAccess,
  EventAttendanceType,
  EventStatus,
  ISearchEvents,
  IEvent,
  IPagedEventResponse,
  IUser,
} from "../../../src/events/api/orval/api/orval-events";
import { IQuery } from "../../../src/search/types/IHubCatalog";
import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { IHubSearchResult } from "../../../src/search/types/IHubSearchResult";

describe("hubSearchEvents", () => {
  afterEach(() => vi.restoreAllMocks());

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
        startDateTime: "2040-07-15T17:00:00.000Z",
        startDate: "2040-07-15",
        startTime: "13:00:00",
        status: EventStatus.PLANNED,
        summary: "Event 1 summary",
        tags: ["tag1"],
        thumbnailUrl: null,
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
        startDateTime: "2030-07-15T17:00:00.000Z",
        startDate: "2030-07-15",
        startTime: "10:00:00",
        status: EventStatus.PLANNED,
        summary: "Event 2 summary",
        tags: ["tag2"],
        thumbnailUrl: null,
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
        startDateTime: "2030-05-15T16:00:00.000Z",
        startDate: "2030-05-15",
        startTime: "10:00:00",
        status: EventStatus.PLANNED,
        summary: "Event 3 summary",
        tags: ["tag3"],
        thumbnailUrl: null,
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
  } as any;
  const options = {
    options: true,
    requestOptions: { requestOptions: true },
  } as unknown as IHubSearchOptions;
  const processedFilters = {
    processedFilters: true,
  } as unknown as Partial<ISearchEvents>;
  const processedOptions = {
    processedOptions: true,
  } as unknown as Partial<ISearchEvents>;
  const processedOptions2 = {
    processedOptions: true,
    start: PAGE_1.nextStart,
  } as unknown as Partial<ISearchEvents>;

  beforeEach(() => {
    vi.spyOn(eventsModule as any, "searchEvents")
      .mockReturnValueOnce(Promise.resolve(PAGE_1))
      .mockReturnValueOnce(Promise.resolve(PAGE_2));
    vi.spyOn(processFiltersModule as any, "processFilters").mockReturnValue(
      processedFilters
    );
    vi.spyOn(processOptionsModule as any, "processOptions")
      .mockReturnValueOnce(processedOptions)
      .mockReturnValueOnce(processedOptions2);
    vi.spyOn(
      eventToSearchResultModule as any,
      "eventToSearchResult"
    ).mockImplementation((event: IEvent) =>
      Promise.resolve({ id: (event as any).id } as IHubSearchResult)
    );
  });

  it("should call events and resolve with an IHubSearchResponse<IHubSearchResult>", async () => {
    const response = await hubSearchEvents(query, options);
    expect(processFiltersModule.processFilters).toHaveBeenCalledTimes(1);
    expect(processFiltersModule.processFilters).toHaveBeenCalledWith(
      query.filters
    );
    expect(processOptionsModule.processOptions).toHaveBeenCalledTimes(1);
    expect(processOptionsModule.processOptions).toHaveBeenCalledWith(options);
    expect(eventsModule.searchEvents).toHaveBeenCalledTimes(1);
    expect(eventsModule.searchEvents).toHaveBeenCalledWith({
      ...options.requestOptions,
      data: {
        ...processedFilters,
        ...processedOptions,
        include: ["creator", "location"],
      },
    });
    expect(eventToSearchResultModule.eventToSearchResult).toHaveBeenCalledTimes(
      2
    );
    expect(eventToSearchResultModule.eventToSearchResult).toHaveBeenCalledWith(
      PAGE_1.items[0],
      options
    );
    expect(eventToSearchResultModule.eventToSearchResult).toHaveBeenCalledWith(
      PAGE_1.items[1],
      options
    );
    expect(response.total).toBe(PAGE_1.total);
    expect(response.hasNext).toBe(true);
    expect(typeof response.next).toBe("function");

    const results2 = await response.next();
    expect(processFiltersModule.processFilters).toHaveBeenCalledTimes(2);
    expect(processOptionsModule.processOptions).toHaveBeenCalledTimes(2);
    expect(eventsModule.searchEvents).toHaveBeenCalledTimes(2);
    expect(eventToSearchResultModule.eventToSearchResult).toHaveBeenCalledTimes(
      3
    );
    expect(results2.total).toBe(PAGE_2.total);
    expect(results2.hasNext).toBe(false);

    try {
      await results2.next();
      throw new Error("Expected results2.next() to throw");
    } catch (e: any) {
      expect(e?.message).toContain(
        "No more hub events for the given query and options"
      );
    }
  });
});
