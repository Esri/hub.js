import { AccessLevel } from "../../../../src/core/types/types";
import { EventAccess, IEvent } from "../../../../src/events/api/types";
import { eventToSearchResult } from "../../../../src/search/_internal/hubEventsHelpers/eventToSearchResult";
import { IHubSearchOptions } from "../../../../src/search/types/IHubSearchOptions";

describe("eventToSearchResult", () => {
  const event = {
    access: EventAccess.PRIVATE,
    id: "31c",
    title: "My event title",
    creator: {
      username: "jdoe",
    },
    summary: "My event summary",
    createdAt: "2024-04-22T12:56:00.189Z",
    updatedAt: "2024-04-22T12:57:00.189Z",
    tags: ["tag1"],
    categories: ["category1"],
  } as IEvent;
  const options = { options: true } as IHubSearchOptions;

  it("should return an IHubSearchResult for the event", () => {
    const result = eventToSearchResult(event, options);
    expect(result).toEqual({
      access: event.access.toLowerCase() as AccessLevel,
      id: event.id,
      type: "Event",
      name: event.title,
      owner: event.creator?.username,
      ownerUser: event.creator,
      summary: event.summary as string,
      createdDate: jasmine.any(Date) as any,
      createdDateSource: "event.createdAt",
      updatedDate: jasmine.any(Date) as any,
      updatedDateSource: "event.updatedAt",
      family: "event",
      links: {
        self: "not-implemented",
        siteRelative: `/events/my-event-title-${event.id}`,
        workspaceRelative: `/workspace/events/${event.id}`,
        thumbnail: "not-implemented",
      },
      tags: event.tags,
      categories: event.categories,
      rawResult: event,
    });
    expect(result.createdDate.toISOString()).toEqual(event.createdAt);
    expect(result.updatedDate.toISOString()).toEqual(event.updatedAt);
  });
});
