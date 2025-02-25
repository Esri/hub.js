import { IHubItemEntity } from "../../src/core/types/IHubItemEntity";
import { shareEntityWithGroups } from "../../src/core/shareEntityWithGroups";
import * as shareEventWithGroupsModule from "../../src/events/_internal/shareEventWithGroups";
import * as shareItemToGroupsModule from "../../src/items/share-item-to-groups";
import { IArcGISContext } from "../../src/IArcGISContext";

describe("shareEntityWithGroups", () => {
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

  it("should call shareEventWithGroups for an event", async () => {
    entity.type = "Event";
    const shareEventWithGroupsSpy = spyOn(
      shareEventWithGroupsModule,
      "shareEventWithGroups"
    ).and.returnValue(Promise.resolve(updatedEntity));
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
    const shareItemToGroupsSpy = spyOn(
      shareItemToGroupsModule,
      "shareItemToGroups"
    ).and.returnValue(Promise.resolve(undefined));
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
