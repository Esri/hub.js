import { IGroup } from "@esri/arcgis-rest-portal";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import {
  cloneObject,
  enrichGroupSearchResult,
  IHubRequestOptions,
} from "../../src";
import * as HubGroupsModule from "../../src/groups/HubGroups";
import * as FetchEnrichments from "../../src/groups/_internal/enrichments";
import * as GetUniqueGroupTitleModule from "../../src/groups/_internal/getUniqueGroupTitle";
import { IHubGroup } from "../../src/core/types/IHubGroup";

const GUID = "9b77674e43cf4bbd9ecad5189b3f1fdc";
const TEST_GROUP: IGroup = {
  id: "23b988acd113446798b0db7a11d27a56",
  title: "dev followers Content",
  isInvitationOnly: false,
  owner: "dev_pre_hub_admin",
  description: "dev followers Content summary",
  snippet: undefined,
  tags: ["Hub Initiative Group", "Open Data"],
  typeKeywords: [],
  phone: undefined,
  sortField: "title",
  sortOrder: "asc",
  isViewOnly: false,
  isOpenData: true,
  featuredItemsId: null,
  thumbnail: "thumbnail/my-group.png",
  created: 1563555829000,
  modified: 1563555830000,
  access: "public",
  capabilities: ["updateitemcontrol"],
  isFav: false,
  isReadOnly: false,
  protected: true,
  autoJoin: false,
  notificationsEnabled: false,
  provider: null,
  providerGroupName: null,
  leavingDisallowed: false,
  hiddenMembers: false,
  membershipAccess: "org",
  displaySettings: {
    itemTypes: "",
  },
  orgId: "ATCRG96GAegBiycU",
  properties: null,
  userMembership: {
    username: "dev_pre_hub_admin",
    memberType: "owner",
    applications: 0,
  },
  collaborationInfo: {},
};

const TEST_HUB_GROUP = {
  id: "3ef",
  name: "A new hub group",
  description: "New hub group summary",
};

describe("HubGroups Module:", () => {
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
        cloneObject(TEST_GROUP),
        [],
        hubRo
      );

      expect(enrichmentSpy.calls.count()).toBe(
        0,
        "should not fetch enrichments"
      );

      // verify expected output
      const GRP = cloneObject(TEST_GROUP);
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
      expect(chk.links?.self).toEqual(
        `https://some-server.com/gis/home/group.html?id=${GRP.id}`
      );
      expect(chk.links?.siteRelative).toEqual(`/groups/${GRP.id}`);
      expect(chk.links?.thumbnail).toEqual(
        `${hubRo.portal}/community/groups/${GRP.id}/info/${GRP.thumbnail}`
      );
      // Group Specific Props
      expect(chk.isSharedUpdate).toBe(true);
      expect(chk.membershipAccess).toBe("org");
      expect(chk.isOpenData).toBe(true);
    });

    it("handles missing capabilities array", async () => {
      const group = cloneObject(TEST_GROUP);
      delete group.capabilities;
      const chk = await enrichGroupSearchResult(group, [], hubRo);
      expect(chk.isSharedUpdate).toBe(false);
    });

    it("uses snippet if defined", async () => {
      const group = cloneObject(TEST_GROUP);
      group.snippet = "This should be used";
      const chk = await enrichGroupSearchResult(group, [], hubRo);
      expect(chk.summary).toEqual(group.snippet);
    });

    it("fetches enrichments", async () => {
      const chk = await enrichGroupSearchResult(
        cloneObject(TEST_GROUP),
        ["contentCount AS itemCount"],
        hubRo
      );

      // verify the response
      expect(chk.itemCount).toBe(23);

      // verify the spy
      expect(enrichmentSpy.calls.count()).toBe(1, "should fetch enrichments");
      const [item, enrichments, ro] = enrichmentSpy.calls.argsFor(0);
      expect(item).toEqual(TEST_GROUP);
      expect(enrichments).toEqual(["contentCount"]);
      expect(ro).toBe(hubRo);
    });
  });

  describe("createHubGroup", () => {
    it("creates a HubGroup from an IGroup", async () => {
      const getUniqueGroupTitleSpy = spyOn(
        GetUniqueGroupTitleModule,
        "getUniqueGroupTitle"
      ).and.returnValue(Promise.resolve(TEST_GROUP.title));
      const portalProtectGroupSpy = spyOn(
        PortalModule,
        "protectGroup"
      ).and.returnValue(Promise.resolve({ success: true }));
      const portalCreateGroupSpy = spyOn(
        PortalModule,
        "createGroup"
      ).and.callFake((group: IGroup) => {
        group.id = TEST_GROUP.id;
        group.description = TEST_GROUP.description;
        group.group.userMembership = {
          memberType: TEST_GROUP.userMembership?.memberType,
        };
        return Promise.resolve(group);
      });
      const chk = await HubGroupsModule.createHubGroup(
        { name: TEST_GROUP.title, protected: TEST_GROUP.protected },
        { authentication: MOCK_AUTH }
      );
      expect(chk.name).toBe("dev followers Content");
      expect(getUniqueGroupTitleSpy).toHaveBeenCalledTimes(1);
      expect(portalCreateGroupSpy).toHaveBeenCalledTimes(1);
      expect(portalProtectGroupSpy).toHaveBeenCalledTimes(1);
      expect(chk.protected).toBe(true);
    });

    it("creates a HubGroup without the protected flag", async () => {
      const getUniqueGroupTitleSpy = spyOn(
        GetUniqueGroupTitleModule,
        "getUniqueGroupTitle"
      ).and.returnValue(Promise.resolve(TEST_GROUP.title));
      const portalProtectGroupSpy = spyOn(
        PortalModule,
        "protectGroup"
      ).and.returnValue(Promise.resolve({ success: true }));
      const portalCreateGroupSpy = spyOn(
        PortalModule,
        "createGroup"
      ).and.callFake((group: IGroup) => {
        group.id = TEST_GROUP.id;
        group.description = TEST_GROUP.description;
        group.group.userMembership = {
          memberType: TEST_GROUP.userMembership?.memberType,
        };
        return Promise.resolve(group);
      });
      const chk = await HubGroupsModule.createHubGroup(
        { name: TEST_GROUP.title, protected: false },
        { authentication: MOCK_AUTH }
      );
      expect(chk.name).toBe("dev followers Content");
      expect(getUniqueGroupTitleSpy).toHaveBeenCalledTimes(1);
      expect(portalCreateGroupSpy).toHaveBeenCalledTimes(1);
      expect(portalProtectGroupSpy).toHaveBeenCalledTimes(0);
      expect(chk.protected).toBe(false);
    });

    it("does not set the protected flag if the protect call fails", async () => {
      const getUniqueGroupTitleSpy = spyOn(
        GetUniqueGroupTitleModule,
        "getUniqueGroupTitle"
      ).and.returnValue(Promise.resolve(TEST_GROUP.title));
      const portalProtectGroupSpy = spyOn(
        PortalModule,
        "protectGroup"
      ).and.returnValue(Promise.resolve({ success: false }));
      const portalCreateGroupSpy = spyOn(
        PortalModule,
        "createGroup"
      ).and.callFake((group: IGroup) => {
        group.id = TEST_GROUP.id;
        group.description = TEST_GROUP.description;
        group.group.userMembership = {
          memberType: TEST_GROUP.userMembership?.memberType,
        };
        return Promise.resolve(group);
      });
      const chk = await HubGroupsModule.createHubGroup(
        { name: TEST_GROUP.title, protected: TEST_GROUP.protected },
        { authentication: MOCK_AUTH }
      );
      expect(chk.name).toBe("dev followers Content");
      expect(getUniqueGroupTitleSpy).toHaveBeenCalledTimes(1);
      expect(portalCreateGroupSpy).toHaveBeenCalledTimes(1);
      expect(portalProtectGroupSpy).toHaveBeenCalledTimes(1);
      expect(chk.protected).toBe(false);
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
      expect(portalGetGroupSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateHubGroup", () => {
    it("updates a HubGroup", async () => {
      const portalUpdateGroupSpy = spyOn(
        PortalModule,
        "updateGroup"
      ).and.returnValue(Promise.resolve(TEST_HUB_GROUP));
      const chk = await HubGroupsModule.updateHubGroup(
        TEST_HUB_GROUP as IHubGroup,
        { authentication: MOCK_AUTH }
      );
      expect(chk.name).toBe("A new hub group");
      expect(portalUpdateGroupSpy).toHaveBeenCalledTimes(1);
    });
    it("updates membershipAccess: anyone", async () => {
      const portalUpdateGroupSpy = spyOn(PortalModule, "updateGroup");
      const chk = await HubGroupsModule.updateHubGroup(
        { ...TEST_HUB_GROUP, membershipAccess: "anyone" } as IHubGroup,
        { authentication: MOCK_AUTH }
      );
      expect(chk.membershipAccess).toBe("anyone");
      // If membershipAccess is "anyone", we will set
      // membershipAccess: null and clearEmptyFields: true
      // to the updateGroup call
      expect(
        portalUpdateGroupSpy.calls.argsFor(0)[0].group.membershipAccess
      ).toBe("");
      expect(
        portalUpdateGroupSpy.calls.argsFor(0)[0].params.clearEmptyFields
      ).toBeTruthy();
    });
    it("updates membershipAccess: organization", async () => {
      const portalUpdateGroupSpy = spyOn(PortalModule, "updateGroup");
      const chk = await HubGroupsModule.updateHubGroup(
        { ...TEST_HUB_GROUP, membershipAccess: "organization" } as IHubGroup,
        { authentication: MOCK_AUTH }
      );
      expect(chk.membershipAccess).toBe("organization");
      expect(
        portalUpdateGroupSpy.calls.argsFor(0)[0].group.membershipAccess
      ).toBe("org");
    });
    it("updates membershipAccess: collaborators", async () => {
      const portalUpdateGroupSpy = spyOn(PortalModule, "updateGroup");
      const chk = await HubGroupsModule.updateHubGroup(
        { ...TEST_HUB_GROUP, membershipAccess: "collaborators" } as IHubGroup,
        { authentication: MOCK_AUTH }
      );
      expect(chk.membershipAccess).toBe("collaborators");
      expect(
        portalUpdateGroupSpy.calls.argsFor(0)[0].group.membershipAccess
      ).toBe("collaboration");
    });
  });

  describe("deleteHubGroup", () => {
    it("delete a HubGroup", async () => {
      const portalRemoveGroupSpy = spyOn(
        PortalModule,
        "removeGroup"
      ).and.returnValue(Promise.resolve({ success: true }));
      await HubGroupsModule.deleteHubGroup(TEST_HUB_GROUP.id, {
        authentication: MOCK_AUTH,
      });
      expect(portalRemoveGroupSpy).toHaveBeenCalledTimes(1);
    });
  });
});
