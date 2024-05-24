import { IEvent } from "../../../src/events/api/orval/api/orval-events";
import { computeLinks } from "../../../src/events/_internal/computeLinks";

describe("computeLinks", () => {
  it("should compute links for an event", () => {
    const event = {
      id: "31c",
      title: "My Event's are awesome! 123 - ",
    } as IEvent;
    const results = computeLinks(event);
    expect(results).toEqual({
      self: "/events/my-events-are-awesome-123-31c",
      siteRelative: "/events/my-events-are-awesome-123-31c",
      siteRelativeEntityType: "",
      workspaceRelative: "/workspace/events/31c",
    });
  });
});
