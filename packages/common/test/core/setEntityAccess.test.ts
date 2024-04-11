import { IHubItemEntity } from "../../src/core/types/IHubItemEntity";
import { setEntityAccess } from "../../src/core/setEntityAccess";
import * as updateEventModule from "../../src/events/api/events";
import * as portalModule from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../../src/ArcGISContext";
import { HubEntity } from "../../src/core/types/HubEntity";

describe("setEntityAccess", () => {
  let entity: HubEntity;
  let context: IArcGISContext;

  beforeEach(() => {
    entity = { id: "9c3", type: "Content", owner: "jdoe" } as HubEntity;
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
  });

  it("should call updateEvent for an event", async () => {
    entity.type = "Event";
    const updateEventSpy = spyOn(
      updateEventModule,
      "updateEvent"
    ).and.returnValue(Promise.resolve(undefined));
    await setEntityAccess(entity, "org", context);
    expect(updateEventSpy).toHaveBeenCalledTimes(1);
    expect(updateEventSpy).toHaveBeenCalledWith({
      eventId: entity.id,
      data: {
        access: "ORG",
      },
      ...context.hubRequestOptions,
    });
  });

  it("should call updateGroup for a group", async () => {
    entity.type = "Group";
    const updateGroupSpy = spyOn(portalModule, "updateGroup").and.returnValue(
      Promise.resolve(undefined)
    );
    await setEntityAccess(entity, "org", context);
    expect(updateGroupSpy).toHaveBeenCalledTimes(1);
    expect(updateGroupSpy).toHaveBeenCalledWith({
      group: {
        id: entity.id,
        access: "org",
      },
      authentication: context.session,
    });
  });

  it("should call setItemAccess for an item", async () => {
    entity.type = "Content";
    const setItemAccessSpy = spyOn(
      portalModule,
      "setItemAccess"
    ).and.returnValue(Promise.resolve(undefined));
    await setEntityAccess(entity, "org", context);
    expect(setItemAccessSpy).toHaveBeenCalledTimes(1);
    expect(setItemAccessSpy).toHaveBeenCalledWith({
      id: entity.id,
      access: "org",
      owner: entity.owner,
      authentication: context.session,
    });
  });
});
