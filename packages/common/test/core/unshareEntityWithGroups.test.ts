import { IHubItemEntity } from "../../src/core/types/IHubItemEntity";
import { unshareEntityWithGroups } from "../../src/core/unshareEntityWithGroups";
import * as unshareEventWithGroupsModule from "../../src/events/_internal/unshareEventWithGroups";
import * as unshareItemFromGroupsModule from "../../src/items/unshare-item-from-groups";
import { IArcGISContext } from "../../src/IArcGISContext";

describe("unshareEntityWithGroups", () => {
  let entity: IHubItemEntity;
  let updatedEntity: IHubItemEntity;
  let context: IArcGISContext;

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

  it("should call unshareEventWithGroups for an event", async () => {
    entity.type = "Event";
    const unshareEventWithGroupsSpy = spyOn(
      unshareEventWithGroupsModule,
      "unshareEventWithGroups"
    ).and.returnValue(Promise.resolve(updatedEntity));
    const res = await unshareEntityWithGroups(entity, ["31c", "5n6"], context);
    expect(unshareEventWithGroupsSpy).toHaveBeenCalledTimes(1);
    expect(unshareEventWithGroupsSpy).toHaveBeenCalledWith(
      ["31c", "5n6"],
      entity,
      context
    );
    expect(res).toEqual(updatedEntity);
  });

  it("should call shareItemToGroups for an item", async () => {
    entity.type = "Content";
    const unshareItemFromGroupsSpy = spyOn(
      unshareItemFromGroupsModule,
      "unshareItemFromGroups"
    ).and.returnValue(Promise.resolve(undefined));
    const res = await unshareEntityWithGroups(entity, ["31c", "5n6"], context);
    expect(unshareItemFromGroupsSpy).toHaveBeenCalledTimes(1);
    expect(unshareItemFromGroupsSpy).toHaveBeenCalledWith(
      entity.id,
      ["31c", "5n6"],
      context.requestOptions,
      entity.owner
    );
    expect(res).toEqual(entity);
  });
});
