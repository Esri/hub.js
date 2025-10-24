import { setEntityAccess } from "../../src/core/setEntityAccess";
import { HubEntity } from "../../src/core/types/HubEntity";
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import * as updateEventModule from "../../src/events/api/events";
// make ESM portal exports spyable by mocking and merging the original
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  updateGroup: vi.fn(),
  setItemAccess: vi.fn(),
}));
import * as portalModule from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../../src/types/IArcGISContext";

describe("setEntityAccess", () => {
  let entity: HubEntity;
  let context: IArcGISContext;

  afterEach(() => {
    vi.restoreAllMocks();
  });

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
    const updateEventSpy = vi
      .spyOn(updateEventModule as any, "updateEvent")
      .mockResolvedValue(undefined as any);
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
    const updateGroupSpy = vi
      .spyOn(portalModule as any, "updateGroup")
      .mockResolvedValue(undefined as any);
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
    const setItemAccessSpy = vi
      .spyOn(portalModule as any, "setItemAccess")
      .mockResolvedValue(undefined as any);
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
