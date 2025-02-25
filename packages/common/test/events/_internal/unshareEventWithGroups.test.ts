import { unshareEventWithGroups } from "../../../src/events/_internal/unshareEventWithGroups";
import * as portalModule from "@esri/arcgis-rest-portal";
import { IHubEvent } from "../../../src/core/types/IHubEvent";
import * as eventsModule from "../../../src/events/api/events";
import { IArcGISContext } from "../../../src/IArcGISContext";

describe("unshareEventWithGroups", () => {
  let updateEventSpy: jasmine.Spy;
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
    ];
    entity = {
      id: "62p",
      readGroupIds: [groups[0].id, groups[1].id],
      editGroupIds: [groups[2].id],
    } as IHubEvent;
    updateEventSpy = spyOn(eventsModule, "updateEvent").and.returnValue(
      Promise.resolve({
        readGroups: [groups[1].id],
        editGroups: [],
      })
    );
  });

  it("should unshare the event from groups", async () => {
    const res = await unshareEventWithGroups(["31c", "52n"], entity, context);
    expect(updateEventSpy).toHaveBeenCalledTimes(1);
    expect(updateEventSpy).toHaveBeenCalledWith({
      eventId: entity.id,
      data: {
        readGroups: ["49a"],
        editGroups: [],
      },
      ...context.hubRequestOptions,
    });
    expect(res).toEqual({
      ...entity,
      readGroupIds: ["49a"],
      editGroupIds: [],
    });
  });

  it("should reject when an error occurs", async () => {
    updateEventSpy.and.returnValue(Promise.reject(new Error("fail")));
    try {
      await unshareEventWithGroups(["31c", "52n"], entity, context);
      fail("did not reject");
    } catch (e) {
      expect(e.message).toEqual(
        "Entity: 62p could not be unshared with groups: 31c, 52n"
      );
    }
    expect(updateEventSpy).toHaveBeenCalledTimes(1);
    expect(updateEventSpy).toHaveBeenCalledWith({
      eventId: entity.id,
      data: {
        readGroups: ["49a"],
        editGroups: [],
      },
      ...context.hubRequestOptions,
    });
  });

  it("should short circuit when groupIds is empty", async () => {
    const res = await unshareEventWithGroups([], entity, context);
    expect(updateEventSpy).not.toHaveBeenCalled();
    expect(res).toEqual(entity);
  });
});
