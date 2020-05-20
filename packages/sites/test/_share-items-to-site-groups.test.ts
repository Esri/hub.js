import { _shareItemsToSiteGroups } from "../src";
import * as portalModule from "@esri/arcgis-rest-portal";
import { IModel, IHubRequestOptions } from "@esri/hub-common";

describe("_shareItemsToSiteGroups", () => {
  it("shares items to groups", async () => {
    const shareSpy = spyOn(portalModule, "shareItemWithGroup").and.returnValue(
      Promise.resolve({})
    );

    const siteModel = {
      item: {
        id: "site-id",
        properties: {
          contentGroupId: "content-id",
          collaborationGroupId: "collab-id"
        }
      }
    } as IModel;

    const toShare = [
      siteModel,
      { item: { id: "foo" } },
      { item: { id: "bar" } }
    ] as IModel[];

    await _shareItemsToSiteGroups(siteModel, toShare, {
      authentication: {}
    } as IHubRequestOptions);

    expect(shareSpy.calls.count()).toBe(
      4,
      "share called correct number of times"
    );
    expect(shareSpy).toHaveBeenCalledWith({
      id: "foo",
      groupId: "content-id",
      confirmItemControl: false,
      authentication: {}
    });
    expect(shareSpy).toHaveBeenCalledWith({
      id: "bar",
      groupId: "collab-id",
      confirmItemControl: true,
      authentication: {}
    });
    expect(shareSpy).toHaveBeenCalledWith({
      id: "foo",
      groupId: "content-id",
      confirmItemControl: false,
      authentication: {}
    });
    expect(shareSpy).toHaveBeenCalledWith({
      id: "bar",
      groupId: "collab-id",
      confirmItemControl: true,
      authentication: {}
    });
  });
});
