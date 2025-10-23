import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
// make @esri/arcgis-rest-portal spyable by merging the original module and
// overriding specific exports in an async mock before importing the module-under-test
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
}));
import { shareEventWithGroups } from "../../../src/events/_internal/shareEventWithGroups";
import * as portalModule from "@esri/arcgis-rest-portal";
import { IHubEvent } from "../../../src/core/types/IHubEvent";
import * as eventsModule from "../../../src/events/api/events";
import * as pollModule from "../../../src/utils/poll";
import { IArcGISContext } from "../../../src/types/IArcGISContext";

describe("shareEventWithGroups", () => {
  let searchGroupsSpy: any;
  let pollSpy: any;
  let updateEventSpy: any;
  let groups: portalModule.IGroup[];
  let context: IArcGISContext;
  let entity: IHubEvent;

  beforeEach(() => {
    context = {
      requestOptions: {
        authentication: {
          portal: "https://some.portal",
        },
      },
      hubRequestOptions: {
        authentication: {
          portal: "https://some.portal",
        },
        hubApiUrl: "https://some.hub",
      },
      session: {},
    } as IArcGISContext;
    groups = [
      { id: "31c", capabilities: [] } as unknown as portalModule.IGroup,
      { id: "49a", capabilities: [] } as unknown as portalModule.IGroup,
      {
        id: "52n",
        capabilities: ["updateitemcontrol"],
      } as unknown as portalModule.IGroup,
      { id: "abc", capabilities: [] } as unknown as portalModule.IGroup,
      {
        id: "def",
        capabilities: ["updateitemcontrol"],
      } as unknown as portalModule.IGroup,
    ];
    entity = {
      id: "62p",
      readGroupIds: [groups[0].id, groups[1].id],
      editGroupIds: [groups[2].id],
    } as IHubEvent;
    pollSpy = vi.spyOn(pollModule, "poll").mockResolvedValue({
      results: [groups[3], groups[4]],
    } as any);
    searchGroupsSpy = vi.spyOn(portalModule, "searchGroups").mockResolvedValue({
      results: [groups[3], groups[4]],
    } as any);
    updateEventSpy = vi.spyOn(eventsModule, "updateEvent").mockResolvedValue({
      readGroups: [groups[0].id, groups[1].id, groups[3].id],
      editGroups: [groups[2].id, groups[4].id],
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should share the event with groups", async () => {
    const res = await shareEventWithGroups(["abc", "def"], entity, context);
    expect(pollSpy).toHaveBeenCalledTimes(1);
    expect(pollSpy).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    );
    expect(updateEventSpy).toHaveBeenCalledTimes(1);
    expect(updateEventSpy).toHaveBeenCalledWith({
      eventId: entity.id,
      data: {
        readGroups: [...entity.readGroupIds, "abc"],
        editGroups: [...entity.editGroupIds, "def"],
      },
      ...context.hubRequestOptions,
    });
    expect(res).toEqual({
      ...entity,
      readGroupIds: [...entity.readGroupIds, "abc"],
      editGroupIds: [...entity.editGroupIds, "def"],
    });
    const fnResults = await (
      pollSpy.mock.calls[0][0] as (...args: any[]) => any
    )();
    expect(fnResults).toEqual({ results: [groups[3], groups[4]] });
    expect(searchGroupsSpy).toHaveBeenCalledTimes(1);
    expect(searchGroupsSpy).toHaveBeenCalledWith({
      q: `id:(abc OR def)`,
      num: 2,
      ...context.requestOptions,
    });
    const validatorResults = await (
      pollSpy.mock.calls[0][1] as (...args: any[]) => any
    )({
      results: [groups[3], groups[4]],
    } as any);
    expect(validatorResults).toEqual(true);
  });

  it("should reject when an error occurs", async () => {
    pollSpy.mockRejectedValue(new Error("fail"));
    await expect(
      shareEventWithGroups(["abc", "def"], entity, context)
    ).rejects.toThrow("Entity: 62p could not be shared with groups: abc, def");
    expect(pollSpy).toHaveBeenCalledTimes(1);
    expect(pollSpy).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should short circuit when groupIds is empty", async () => {
    const res = await shareEventWithGroups([], entity, context);
    expect(pollSpy).not.toHaveBeenCalled();
    expect(updateEventSpy).not.toHaveBeenCalled();
    expect(res).toEqual(entity);
  });
});
