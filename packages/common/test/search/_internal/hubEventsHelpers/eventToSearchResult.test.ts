import * as restPortal from "@esri/arcgis-rest-portal";
import { AccessLevel } from "../../../../src/core/types/types";
import {
  EventAccess,
  EventLocationType,
  IEvent,
} from "../../../../src/events/api/types";
import { eventToSearchResult } from "../../../../src/search/_internal/hubEventsHelpers/eventToSearchResult";
import { IHubSearchOptions } from "../../../../src/search/types/IHubSearchOptions";
import { getEventThumbnail } from "../../../../src/events/_internal/getEventThumbnail";
import * as getLocationFromEventModule from "../../../../src/events/_internal/getLocationFromEvent";
import { IHubLocation } from "../../../../src/core/types/IHubLocation";

describe("eventToSearchResult", () => {
  const options = {
    options: true,
    requestOptions: { requestOptions: true },
  } as unknown as IHubSearchOptions;
  const user = {
    id: "user1",
    username: "jdoe",
  } as restPortal.IUser;
  let event: IEvent;
  let getUserSpy: jasmine.Spy;
  let getLocationFromEventSpy: jasmine.Spy;
  let locationResult: IHubLocation;

  beforeEach(() => {
    event = {
      access: EventAccess.PRIVATE,
      id: "31c",
      title: "My event title",
      creator: {
        username: user.username,
      },
      summary: "My event summary",
      description: "My event description",
      createdAt: "2024-04-22T12:56:00.189Z",
      updatedAt: "2024-04-22T12:57:00.189Z",
      tags: ["tag1"],
      categories: ["category1"],
      location: {
        id: "cm1gtkbua00a23w01sbsxi82p",
        addNum: null,
        city: null,
        cntryName: null,
        eventId: "clzk9pssv007a6001c93uijky",
        extent: [
          [-76.86333891686775, 40.33607098418021],
          [-76.85833891686775, 40.34107098418021],
        ],
        geometries: [
          {
            x: -76.86083891686775,
            y: 40.33857098418021,
            type: "point",
            spatialReference: {
              wkid: 4326,
            },
          },
        ],
        nbrhd: null,
        placeAddr: null,
        placeName: null,
        postal: null,
        region: null,
        spatialReference: {
          wkid: 4326,
        },
        stDir: null,
        stName: null,
        stType: null,
        subRegion: null,
        type: EventLocationType.custom,
      },
    } as unknown as IEvent;
    locationResult = {
      type: "custom",
      spatialReference: { wkid: 4326 },
      extent: [
        [-76.86333891686775, 40.33607098418021],
        [-76.85833891686775, 40.34107098418021],
      ],
      geometries: [
        {
          x: -76.86083891686775,
          y: 40.33857098418021,
          type: "point",
          spatialReference: Object({ wkid: 4326 }),
        },
      ],
    } as unknown as IHubLocation;
    getUserSpy = spyOn(restPortal, "getUser").and.returnValue(
      Promise.resolve(user)
    );
    getLocationFromEventSpy = spyOn(
      getLocationFromEventModule,
      "getLocationFromEvent"
    ).and.returnValue(locationResult);
  });

  it("should return an IHubSearchResult for the event", async () => {
    const result = await eventToSearchResult(event, options);
    expect(getUserSpy).toHaveBeenCalledTimes(1);
    expect(getUserSpy).toHaveBeenCalledWith({
      username: event.creator?.username,
      ...options.requestOptions,
    });
    expect(getLocationFromEventSpy).toHaveBeenCalledTimes(1);
    expect(getLocationFromEventSpy).toHaveBeenCalledWith(event);
    expect(result).toEqual({
      access: event.access.toLowerCase() as AccessLevel,
      id: event.id,
      type: "Event",
      name: event.title,
      owner: event.creator?.username,
      ownerUser: user,
      summary: event.summary as string,
      createdDate: jasmine.any(Date) as any,
      createdDateSource: "event.createdAt",
      updatedDate: jasmine.any(Date) as any,
      updatedDateSource: "event.updatedAt",
      family: "event",
      links: {
        self: `/events/my-event-title-${event.id}`,
        siteRelative: `/events/my-event-title-${event.id}`,
        siteRelativeEntityType: "",
        workspaceRelative: `/workspace/events/${event.id}`,
        thumbnail: getEventThumbnail(),
      },
      tags: event.tags,
      categories: event.categories,
      rawResult: event,
      location: locationResult,
    });
    expect(result.createdDate.toISOString()).toEqual(event.createdAt);
    expect(result.updatedDate.toISOString()).toEqual(event.updatedAt);
  });

  it("should set summary to event.description when event.summary is falsey", async () => {
    event.summary = null;
    const result = await eventToSearchResult(event, options);
    expect(getUserSpy).toHaveBeenCalledTimes(1);
    expect(getUserSpy).toHaveBeenCalledWith({
      username: event.creator?.username,
      ...options.requestOptions,
    });
    expect(getLocationFromEventSpy).toHaveBeenCalledTimes(1);
    expect(getLocationFromEventSpy).toHaveBeenCalledWith(event);
    expect(result).toEqual({
      access: event.access.toLowerCase() as AccessLevel,
      id: event.id,
      type: "Event",
      name: event.title,
      owner: event.creator?.username,
      ownerUser: user,
      summary: event.description as string,
      createdDate: jasmine.any(Date) as any,
      createdDateSource: "event.createdAt",
      updatedDate: jasmine.any(Date) as any,
      updatedDateSource: "event.updatedAt",
      family: "event",
      links: {
        self: `/events/my-event-title-${event.id}`,
        siteRelative: `/events/my-event-title-${event.id}`,
        siteRelativeEntityType: "",
        workspaceRelative: `/workspace/events/${event.id}`,
        thumbnail: getEventThumbnail(),
      },
      tags: event.tags,
      categories: event.categories,
      rawResult: event,
      location: locationResult,
    });
    expect(result.createdDate.toISOString()).toEqual(event.createdAt);
    expect(result.updatedDate.toISOString()).toEqual(event.updatedAt);
  });
});
