import { IHubItemEntity } from "../../src/core/types/IHubItemEntity";
import { shareEntityWithGroups } from "../../src/core/shareEntityWithGroups";
import * as shareEventWithGroupsModule from "../../src/events/_internal/shareEventWithGroups";
import * as shareItemToGroupsModule from "../../src/items/share-item-to-groups";
import { IArcGISContext } from "../../src/types/IArcGISContext";
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

describe("shareEntityWithGroups", () => {
  let entity: IHubItemEntity;
  let updatedEntity: IHubItemEntity;
  let context: IArcGISContext;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    entity = { id: "9c3", type: "Content", owner: "jdoe" } as IHubItemEntity;
    updatedEntity = { ...entity, updatedDate: new Date() } as IHubItemEntity;
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

  it("should call shareEventWithGroups for an event", async () => {
    entity.type = "Event";
    const shareEventWithGroupsSpy = vi
      .spyOn(shareEventWithGroupsModule as any, "shareEventWithGroups")
      .mockResolvedValue(updatedEntity as any);
    const res = await shareEntityWithGroups(entity, ["31c", "5n6"], context);
    expect(shareEventWithGroupsSpy).toHaveBeenCalledTimes(1);
    expect(shareEventWithGroupsSpy).toHaveBeenCalledWith(
      ["31c", "5n6"],
      entity,
      context
    );
    expect(res).toEqual(updatedEntity);
  });

  it("should call shareItemToGroups for an item", async () => {
    entity.type = "Content";
    const shareItemToGroupsSpy = vi
      .spyOn(shareItemToGroupsModule as any, "shareItemToGroups")
      .mockResolvedValue(undefined as any);
    const res = await shareEntityWithGroups(entity, ["31c", "5n6"], context);
    expect(shareItemToGroupsSpy).toHaveBeenCalledTimes(1);
    expect(shareItemToGroupsSpy).toHaveBeenCalledWith(
      entity.id,
      ["31c", "5n6"],
      context.requestOptions,
      entity.owner
    );
    expect(res).toEqual(entity);
  });
});
