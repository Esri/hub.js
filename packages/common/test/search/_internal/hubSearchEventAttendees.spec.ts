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
  afterEach(() => vi.restoreAllMocks());

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
  } as any;

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
  } as any;

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
  } as unknown as Partial<GetRegistrationsParams>;
  const processedOptions = {
    processedOptions: true,
  } as unknown as Partial<GetRegistrationsParams>;
  const processedOptions2 = {
    processedOptions: true,
    start: PAGE_1.nextStart,
  } as unknown as Partial<GetRegistrationsParams>;

  beforeEach(() => {
    let call = 0;
    vi.spyOn(eventsAPI as any, "getRegistrations").mockImplementation(() => {
      call++;
      return Promise.resolve(call === 1 ? PAGE_1 : PAGE_2);
    });
    vi.spyOn(
      processFiltersModule as any,
      "processAttendeeFilters"
    ).mockReturnValue(processedFilters);
    let optCall = 0;
    vi.spyOn(
      processOptionsModule as any,
      "processAttendeeOptions"
    ).mockImplementation(() => {
      optCall++;
      return optCall === 1 ? processedOptions : processedOptions2;
    });
    vi.spyOn(
      eventAttendeeToSearchResultModule as any,
      "eventAttendeeToSearchResult"
    ).mockImplementation((attendee: IRegistration) =>
      Promise.resolve({
        id: (attendee as any).id.toString(),
      } as IHubSearchResult)
    );
  });

  it("should call getRegistrations and resolve with an IHubSearchResponse<IHubSearchResult>", async () => {
    const response = await hubSearchEventAttendees(query, options);
    expect(processFiltersModule.processAttendeeFilters).toHaveBeenCalledTimes(
      1
    );
    expect(processFiltersModule.processAttendeeFilters).toHaveBeenCalledWith(
      query
    );
    expect(processOptionsModule.processAttendeeOptions).toHaveBeenCalledTimes(
      1
    );
    expect(processOptionsModule.processAttendeeOptions).toHaveBeenCalledWith(
      options
    );
    expect(eventsAPI.getRegistrations).toHaveBeenCalledTimes(1);
    expect(eventsAPI.getRegistrations).toHaveBeenCalledWith({
      ...options.requestOptions,
      data: {
        ...processedFilters,
        ...processedOptions,
      },
    });
    expect(
      eventAttendeeToSearchResultModule.eventAttendeeToSearchResult
    ).toHaveBeenCalledTimes(2);
    expect(
      eventAttendeeToSearchResultModule.eventAttendeeToSearchResult
    ).toHaveBeenCalledWith(PAGE_1.items[0], options);
    expect(
      eventAttendeeToSearchResultModule.eventAttendeeToSearchResult
    ).toHaveBeenCalledWith(PAGE_1.items[1], options);
    expect(response.total).toBe(PAGE_1.total);
    expect(typeof response.next).toBe("function");

    const results2 = await response.next();
    expect(processFiltersModule.processAttendeeFilters).toHaveBeenCalledTimes(
      2
    );
    expect(processOptionsModule.processAttendeeOptions).toHaveBeenCalledTimes(
      2
    );
    expect(eventsAPI.getRegistrations).toHaveBeenCalledTimes(2);
    expect(
      eventAttendeeToSearchResultModule.eventAttendeeToSearchResult
    ).toHaveBeenCalledTimes(4);
    expect(results2.total).toBe(PAGE_2.total);
    expect(results2.hasNext).toBe(false);

    try {
      await results2.next();
      throw new Error("did not reject");
    } catch (e) {
      const error = e as { message?: string };
      expect(error.message).toEqual(
        "No more hub events for the given query and options"
      );
    }
  });
});
