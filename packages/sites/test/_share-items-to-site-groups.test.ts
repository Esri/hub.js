import { _shareItemsToSiteGroups } from "../src";
import * as portalModule from "@esri/arcgis-rest-portal";
import { IModel, IHubRequestOptions } from "@esri/hub-common";
import * as sharingEligibleModelsModule from "../src/_get-sharing-eligible-models";

describe("_shareItemsToSiteGroups", () => {
  it("shares items to groups using shareItemsToSiteGroups", async () => {
    const shareSpy = spyOn(portalModule, "shareItemWithGroup").and.returnValue(
      Promise.resolve({})
    );

    const siteModel = {
      item: {
        id: "site-id",
        properties: {
          contentGroupId: "content-id",
          collaborationGroupId: "collab-id",
        },
      },
    } as IModel;

    const hubRequestOptions = {
      authentication: {},
    } as IHubRequestOptions;

    const toShare = [
      siteModel,
      { item: { id: "foo" } },
      { item: { id: "bar" } },
    ] as IModel[];

    const _getSharingEligibleModelsSpy = spyOn(
      sharingEligibleModelsModule,
      "_getSharingEligibleModels"
    ).and.returnValue(Promise.resolve(toShare.slice(1, 3)));

    await _shareItemsToSiteGroups(siteModel, toShare, hubRequestOptions);

    expect(_getSharingEligibleModelsSpy.calls.count()).toBe(
      1,
      "calls _getSharingEligibleModelsSpy once"
    );
    expect(_getSharingEligibleModelsSpy).toHaveBeenCalledWith(
      siteModel,
      toShare,
      hubRequestOptions
    );
    expect(shareSpy.calls.count()).toBe(
      4,
      "share called correct number of times"
    );
    expect(shareSpy).toHaveBeenCalledWith({
      id: "foo",
      groupId: "content-id",
      confirmItemControl: false,
      authentication: {},
    });
    expect(shareSpy).toHaveBeenCalledWith({
      id: "bar",
      groupId: "collab-id",
      confirmItemControl: true,
      authentication: {},
    });
    expect(shareSpy).toHaveBeenCalledWith({
      id: "foo",
      groupId: "content-id",
      confirmItemControl: false,
      authentication: {},
    });
    expect(shareSpy).toHaveBeenCalledWith({
      id: "bar",
      groupId: "collab-id",
      confirmItemControl: true,
      authentication: {},
    });
  });
});
