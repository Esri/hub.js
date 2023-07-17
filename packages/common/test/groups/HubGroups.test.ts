import { IGroup } from "@esri/arcgis-rest-portal";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import {
  ArcGISContextManager,
  cloneObject,
  enrichGroupSearchResult,
  IHubRequestOptions,
} from "../../src";
import * as HubGroupsModule from "../../src/groups/HubGroups";
import * as FetchEnrichments from "../../src/groups/_internal/enrichments";
import { IHubGroup } from "../../src/core/types/IHubGroup";
import * as TEST_GROUP from "../mocks/groups/group.json";
import * as TEST_HUB_GROUP from "../mocks/groups/hub-group.json";

const GUID = "9b77674e43cf4bbd9ecad5189b3f1fdc";

describe("HubGroups Module:", () => {
  let authdCtxMgr: ArcGISContextManager;
  let unauthdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    unauthdCtxMgr = await ArcGISContextManager.create();
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
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
      portalUrl: "https://myserver.com",
    });
  });
  describe("enrichments:", () => {
    let enrichmentSpy: jasmine.Spy;
    let hubRo: IHubRequestOptions;
    beforeEach(() => {
      enrichmentSpy = spyOn(
        FetchEnrichments,
        "fetchGroupEnrichments"
      ).and.callFake(() => {
        return Promise.resolve({
          contentCount: 23,
        });
      });
      hubRo = {
        portal: "https://some-server.com/gis/sharing/rest",
      };
    });

    it("converts item to search result", async () => {
      const chk = await enrichGroupSearchResult(
        cloneObject(TEST_GROUP as IGroup),
        [],
        hubRo
      );

      expect(enrichmentSpy.calls.count()).toBe(
        0,
        "should not fetch enrichments"
      );

      // verify expected output
      const GRP = cloneObject(TEST_GROUP as IGroup);
      expect(chk.access).toEqual(GRP.access);
      expect(chk.id).toEqual(GRP.id);
      expect(chk.type).toEqual("Group");
      expect(chk.name).toEqual(GRP.title);
      expect(chk.owner).toEqual(GRP.owner);
      expect(chk.summary).toEqual(GRP.description);
      expect(chk.createdDate).toEqual(new Date(GRP.created));
      expect(chk.createdDateSource).toEqual("group.created");
      expect(chk.updatedDate).toEqual(new Date(GRP.modified));
      expect(chk.updatedDateSource).toEqual("group.modified");
      expect(chk.family).toEqual("team");
      expect(chk.links.self).toEqual(
        `https://some-server.com/gis/home/group.html?id=${GRP.id}`
      );
      expect(chk.links.siteRelative).toEqual(`/teams/${GRP.id}`);
      expect(chk.links.thumbnail).toEqual(
        `${hubRo.portal}/community/groups/${GRP.id}/info/${GRP.thumbnail}`
      );
      // Group Specific Props
      expect(chk.isSharedUpdate).toBe(true);
      expect(chk.membershipAccess).toBe("org");
      expect(chk.isOpenData).toBe(true);
    });

    it("handles missing capabilities array", async () => {
      const itm = cloneObject(TEST_GROUP as IGroup);
      delete itm.capabilities;
      const chk = await enrichGroupSearchResult(itm, [], hubRo);
      expect(chk.isSharedUpdate).toBe(false);
    });

    it("uses snippet if defined", async () => {
      const itm = cloneObject(TEST_GROUP as IGroup);
      itm.snippet = "This should be used";
      const chk = await enrichGroupSearchResult(itm, [], hubRo);
      expect(chk.summary).toEqual(itm.snippet);
    });

    it("fetches enrichments", async () => {
      const chk = await enrichGroupSearchResult(
        cloneObject(TEST_GROUP as IGroup),
        ["contentCount AS itemCount"],
        hubRo
      );

      // verify the response
      expect(chk.itemCount).toBe(23);

      // verify the spy
      expect(enrichmentSpy.calls.count()).toBe(1, "should fetch enrichments");
      const [item, enrichments, ro] = enrichmentSpy.calls.argsFor(0);
      expect(item).toEqual(TEST_GROUP as IGroup);
      expect(enrichments).toEqual(["contentCount"]);
      expect(ro).toBe(hubRo);
    });
  });

  describe("createHubGroup", () => {
    it("creates a HubGroup from an IGroup", async () => {
      const portalCreateGroupSpy = spyOn(
        PortalModule,
        "createGroup"
      ).and.callFake((group: IGroup) => {
        group.id = TEST_GROUP.id;
        group.description = TEST_GROUP.description;
        return Promise.resolve(group);
      });
      const chk = await HubGroupsModule.createHubGroup(
        { name: TEST_GROUP.title },
        { authentication: MOCK_AUTH }
      );
      expect(chk.name).toBe("dev followers Content");
      expect(portalCreateGroupSpy.calls.count()).toBe(1);
    });
  });

  describe("fetchHubGroup", () => {
    it("fetches a HubGroup", async () => {
      const portalGetGroupSpy = spyOn(PortalModule, "getGroup").and.returnValue(
        Promise.resolve(TEST_GROUP)
      );
      const chk = await HubGroupsModule.fetchHubGroup(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.name).toBe("dev followers Content");
      expect(chk.description).toBe("dev followers Content summary");
      expect(portalGetGroupSpy.calls.count()).toBe(1);
    });
  });

  describe("updateHubGroup", () => {
    it("updates a HubGroup", async () => {
      const portalGetGroupSpy = spyOn(PortalModule, "getGroup").and.returnValue(
        Promise.resolve(TEST_GROUP)
      );
      const portalUpdateGroupSpy = spyOn(
        PortalModule,
        "updateGroup"
      ).and.returnValue(Promise.resolve(TEST_HUB_GROUP));
      const chk = await HubGroupsModule.updateHubGroup(
        TEST_HUB_GROUP as IHubGroup,
        { authentication: MOCK_AUTH }
      );
      expect(chk.name).toBe("A new hub group");
      expect(chk.summary).toBe("New hub group summary");
      expect(portalGetGroupSpy.calls.count()).toBe(1);
      expect(portalUpdateGroupSpy.calls.count()).toBe(1);
    });
  });

  describe("deleteHubGroup", () => {
    it("delete a HubGroup", async () => {
      const portalRemoveGroupSpy = spyOn(
        PortalModule,
        "removeGroup"
      ).and.returnValue(Promise.resolve({ success: true }));
      const chk = await HubGroupsModule.deleteHubGroup(TEST_HUB_GROUP.id, {
        authentication: MOCK_AUTH,
      });
      expect(portalRemoveGroupSpy.calls.count()).toBe(1);
    });
  });
});
