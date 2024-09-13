import { IHubItemEntity } from "../../src/core/types/IHubItemEntity";
import { getEntityGroups } from "../../src/core/getEntityGroups";
import * as getEventGroupsModule from "../../src/events/getEventGroups";
import { IArcGISContext } from "../../src/ArcGISContext";
import * as sharedWithModule from "../../src/core/_internal/sharedWith";
import { IGroup } from "@esri/arcgis-rest-portal";

describe("getEntityGroups", () => {
  let entity: IHubItemEntity;
  let context: IArcGISContext;
  let groups: IGroup[];

  beforeEach(() => {
    entity = { id: "9c3", type: "Content" } as IHubItemEntity;
    context = {
      requestOptions: {
        authentication: {
          portal: "https://some.portal",
        },
      },
    } as IArcGISContext;
    groups = [
      { id: "31c", capabilities: [] } as unknown as IGroup,
      { id: "5n6", capabilities: ["updateitemcontrol"] } as unknown as IGroup,
    ];
  });

  it("should call getEventGroups for an event", async () => {
    entity.type = "Event";
    const getEventGroupsSpy = spyOn(
      getEventGroupsModule,
      "getEventGroups"
    ).and.returnValue(Promise.resolve(groups));
    const res = await getEntityGroups(entity, context);
    expect(res).toEqual(groups);
    expect(getEventGroupsSpy).toHaveBeenCalledTimes(1);
    expect(getEventGroupsSpy).toHaveBeenCalledWith(entity.id, context);
  });

  it("should call sharedWith for an other", async () => {
    const sharedWithSpy = spyOn(sharedWithModule, "sharedWith").and.returnValue(
      Promise.resolve(groups)
    );
    const res = await getEntityGroups(entity, context);
    expect(res).toEqual(groups);
    expect(sharedWithSpy).toHaveBeenCalledTimes(1);
    expect(sharedWithSpy).toHaveBeenCalledWith(
      entity.id,
      context.requestOptions
    );
  });
});
