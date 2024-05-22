import * as restPortal from "@esri/arcgis-rest-portal";
import { AccessLevel } from "../../../../src/core/types/types";
import { EventAccess, IEvent } from "../../../../src/events/api/types";
import { eventToSearchResult } from "../../../../src/search/_internal/hubEventsHelpers/eventToSearchResult";
import { IHubSearchOptions } from "../../../../src/search/types/IHubSearchOptions";

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
    } as IEvent;
    getUserSpy = spyOn(restPortal, "getUser").and.returnValue(
      Promise.resolve(user)
    );
  });

  it("should return an IHubSearchResult for the event", async () => {
    const result = await eventToSearchResult(event, options);
    expect(getUserSpy).toHaveBeenCalledTimes(1);
    expect(getUserSpy).toHaveBeenCalledWith({
      username: event.creator?.username,
      ...options.requestOptions,
    });
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
      },
      tags: event.tags,
      categories: event.categories,
      rawResult: event,
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
      },
      tags: event.tags,
      categories: event.categories,
      rawResult: event,
    });
    expect(result.createdDate.toISOString()).toEqual(event.createdAt);
    expect(result.updatedDate.toISOString()).toEqual(event.updatedAt);
  });
});
