import { ArcGISContextManager, HubEntity, getProp } from "../../src";
import { enrichEntity } from "../../src/core/enrichEntity";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";

describe("enrichEntity", () => {
  let authdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
      } as unknown as PortalModule.IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as PortalModule.IPortal,
      portalUrl: "https://fake-org.maps.arcgis.com",
    });
  });

  it("doesn't add anything to the entity if no enrichments are requested", async () => {
    const chk = await enrichEntity(
      {} as HubEntity,
      [],
      authdCtxMgr.context.hubRequestOptions
    );

    expect(chk).toEqual({} as HubEntity);
  });
  it("enriches the entity based on the enrichment spec", async () => {
    spyOn(PortalModule, "getGroup").and.returnValue(
      Promise.resolve({
        id: "00c",
        access: "public",
      })
    );

    const chk = await enrichEntity(
      { followersGroupId: "followers_00c" } as HubEntity,
      ["followersGroup.access AS _followersGroup.access"],
      authdCtxMgr.context.hubRequestOptions
    );

    expect(getProp(chk, "_followersGroup.access")).toBe("public");
  });

  describe("followersGroup enrichment", () => {
    let getGroupSpy: any;
    afterEach(() => {
      getGroupSpy.calls.reset();
    });
    it("enriches the entity with the followers group", async () => {
      const mockFollowersGroup = {
        id: "00c",
        access: "public",
      };
      getGroupSpy = spyOn(PortalModule, "getGroup").and.returnValue(
        Promise.resolve(mockFollowersGroup)
      );

      const chk = await enrichEntity(
        { followersGroupId: "followers_00c" } as HubEntity,
        ["followersGroup AS _followersGroup"],
        authdCtxMgr.context.hubRequestOptions
      );

      expect(getGroupSpy).toHaveBeenCalledTimes(1);
      expect(getGroupSpy).toHaveBeenCalledWith(
        "followers_00c",
        authdCtxMgr.context.hubRequestOptions
      );
      expect(getProp(chk, "_followersGroup")).toBe(mockFollowersGroup);
    });
    it("returns an empty object if there isn't a followersGroupId defined on the entity", async () => {
      getGroupSpy = spyOn(PortalModule, "getGroup");
      const chk = await enrichEntity(
        {} as HubEntity,
        ["followersGroup AS _followersGroup"],
        authdCtxMgr.context.hubRequestOptions
      );
      expect(getGroupSpy).not.toHaveBeenCalled();
      expect(getProp(chk, "_followersGroup")).toEqual({});
    });
    it("returns an empty object and handles the error if there's an issue fetching the followers group", async () => {
      getGroupSpy = spyOn(PortalModule, "getGroup").and.returnValue(
        Promise.reject()
      );

      const chk = await enrichEntity(
        { followersGroupId: "followers_00c" } as HubEntity,
        ["followersGroup AS _followersGroup"],
        authdCtxMgr.context.hubRequestOptions
      );

      expect(getGroupSpy).toHaveBeenCalledTimes(1);
      expect(getGroupSpy).toHaveBeenCalledWith(
        "followers_00c",
        authdCtxMgr.context.hubRequestOptions
      );
      expect(getProp(chk, "_followersGroup")).toEqual({});
    });
  });
});
