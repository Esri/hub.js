import { vi } from "vitest";

vi.mock("@esri/arcgis-rest-portal", async (importOriginal: any) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getGroup: vi.fn(),
    createGroup: vi.fn(),
    protectGroup: vi.fn(),
    updateGroup: vi.fn(),
    removeGroup: vi.fn(),
  };
});

import { IGroup } from "@esri/arcgis-rest-portal";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as HubGroupsModule from "../../src/groups/HubGroups";
import * as FetchEnrichments from "../../src/groups/_internal/enrichments";
import * as GetUniqueGroupTitleModule from "../../src/groups/_internal/getUniqueGroupTitle";
import * as createOrUpdateEntitySettingsModule from "../../src/core/_internal/createOrUpdateEntitySettings";
import { IHubGroup } from "../../src/core/types/IHubGroup";
import { IHubRequestOptions } from "../../src/hub-types";
import { enrichGroupSearchResult } from "../../src/groups/enrichGroupSearchResult";
import { cloneObject } from "../../src/util";
import { IArcGISContext } from "../../src/types/IArcGISContext";

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
    let enrichmentSpy: ReturnType<typeof vi.spyOn>;
    let hubRo: IHubRequestOptions;

    beforeEach(() => {
      enrichmentSpy = vi
        .spyOn(FetchEnrichments, "fetchGroupEnrichments")
        .mockImplementation(() => {
          return Promise.resolve({ contentCount: 23 });
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

      expect(enrichmentSpy).toHaveBeenCalledTimes(0);

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
      expect(enrichmentSpy).toHaveBeenCalledTimes(1);
      const [item, enrichments, ro] = enrichmentSpy.mock.calls[0];
      expect(item).toEqual(TEST_GROUP);
      expect(enrichments).toEqual(["contentCount"]);
      expect(ro).toBe(hubRo);
    });
  });

  describe("createHubGroup", () => {
    it("creates a HubGroup from an IGroup", async () => {
      const getUniqueGroupTitleSpy = vi
        .spyOn(GetUniqueGroupTitleModule, "getUniqueGroupTitle")
        .mockResolvedValue(TEST_GROUP.title as any);
      const createOrUpdateEntitySettingsSpy = vi
        .spyOn(
          createOrUpdateEntitySettingsModule,
          "createOrUpdateEntitySettings"
        )
        .mockResolvedValue({ id: "abc", settings: { discussions: {} } } as any);
      const portalProtectGroupSpy = vi
        .spyOn(PortalModule, "protectGroup")
        .mockResolvedValue({ success: true } as any);
      const portalCreateGroupSpy = vi
        .spyOn(PortalModule, "createGroup")
        .mockImplementation((group: any) => {
          group.id = TEST_GROUP.id;
          group.description = TEST_GROUP.description;
          group.group.userMembership = {
            memberType: TEST_GROUP.userMembership?.memberType,
          };
          group.protected = false;
          return Promise.resolve(group);
        });
      const chk = await HubGroupsModule.createHubGroup(
        { name: TEST_GROUP.title, protected: TEST_GROUP.protected },
        {
          userRequestOptions: { authentication: MOCK_AUTH },
          isPortal: false,
        } as IArcGISContext
      );
      expect(chk.name).toBe("dev followers Content");
      expect(getUniqueGroupTitleSpy).toHaveBeenCalledTimes(1);
      expect(createOrUpdateEntitySettingsSpy).toHaveBeenCalledTimes(1);
      expect(portalCreateGroupSpy).toHaveBeenCalledTimes(1);
      expect(portalProtectGroupSpy).toHaveBeenCalledTimes(1);
      expect(chk.protected).toBe(true);
    });

    it("creates a HubGroup without the protected flag", async () => {
      const getUniqueGroupTitleSpy = vi
        .spyOn(GetUniqueGroupTitleModule, "getUniqueGroupTitle")
        .mockResolvedValue(TEST_GROUP.title as any);
      const createOrUpdateEntitySettingsSpy = vi
        .spyOn(
          createOrUpdateEntitySettingsModule,
          "createOrUpdateEntitySettings"
        )
        .mockResolvedValue({ id: "abc", settings: { discussions: {} } } as any);
      const portalProtectGroupSpy = vi
        .spyOn(PortalModule, "protectGroup")
        .mockResolvedValue({ success: true } as any);
      const portalCreateGroupSpy = vi
        .spyOn(PortalModule, "createGroup")
        .mockImplementation((group: any) => {
          group.id = TEST_GROUP.id;
          group.description = TEST_GROUP.description;
          group.group.userMembership = {
            memberType: TEST_GROUP.userMembership?.memberType,
          };
          group.protected = false;
          return Promise.resolve(group);
        });
      const chk = await HubGroupsModule.createHubGroup(
        { name: TEST_GROUP.title, protected: false },
        {
          userRequestOptions: { authentication: MOCK_AUTH },
          isPortal: false,
        } as IArcGISContext
      );
      expect(chk.name).toBe("dev followers Content");
      expect(getUniqueGroupTitleSpy).toHaveBeenCalledTimes(1);
      expect(createOrUpdateEntitySettingsSpy).toHaveBeenCalledTimes(1);
      expect(portalCreateGroupSpy).toHaveBeenCalledTimes(1);
      expect(portalProtectGroupSpy).toHaveBeenCalledTimes(0);
      expect(chk.protected).toBe(false);
    });

    it("does not set the protected flag if the protect call fails", async () => {
      const getUniqueGroupTitleSpy = vi
        .spyOn(GetUniqueGroupTitleModule, "getUniqueGroupTitle")
        .mockResolvedValue(TEST_GROUP.title as any);
      const createOrUpdateEntitySettingsSpy = vi
        .spyOn(
          createOrUpdateEntitySettingsModule,
          "createOrUpdateEntitySettings"
        )
        .mockResolvedValue({ id: "abc", settings: { discussions: {} } } as any);
      const portalProtectGroupSpy = vi
        .spyOn(PortalModule, "protectGroup")
        .mockResolvedValue({ success: false } as any);
      const portalCreateGroupSpy = vi
        .spyOn(PortalModule, "createGroup")
        .mockImplementation((group: any) => {
          group.id = TEST_GROUP.id;
          group.description = TEST_GROUP.description;
          group.group.userMembership = {
            memberType: TEST_GROUP.userMembership?.memberType,
          };
          group.protected = false;
          return Promise.resolve(group);
        });
      const chk = await HubGroupsModule.createHubGroup(
        { name: TEST_GROUP.title, protected: TEST_GROUP.protected },
        {
          userRequestOptions: { authentication: MOCK_AUTH },
          isPortal: false,
        } as IArcGISContext
      );
      expect(chk.name).toBe("dev followers Content");
      expect(getUniqueGroupTitleSpy).toHaveBeenCalledTimes(1);
      expect(createOrUpdateEntitySettingsSpy).toHaveBeenCalledTimes(1);
      expect(portalCreateGroupSpy).toHaveBeenCalledTimes(1);
      expect(portalProtectGroupSpy).toHaveBeenCalledTimes(1);
      expect(chk.protected).toBe(false);
    });

    it("does not set discussion settings if in enterprise", async () => {
      const getUniqueGroupTitleSpy = vi
        .spyOn(GetUniqueGroupTitleModule, "getUniqueGroupTitle")
        .mockResolvedValue(TEST_GROUP.title as any);
      const portalProtectGroupSpy = vi
        .spyOn(PortalModule, "protectGroup")
        .mockResolvedValue({ success: true } as any);
      const portalCreateGroupSpy = vi
        .spyOn(PortalModule, "createGroup")
        .mockImplementation((group: any) => {
          group.id = TEST_GROUP.id;
          group.description = TEST_GROUP.description;
          group.group.userMembership = {
            memberType: TEST_GROUP.userMembership?.memberType,
          };
          group.protected = false;
          return Promise.resolve(group);
        });
      const chk = await HubGroupsModule.createHubGroup(
        { name: TEST_GROUP.title, protected: TEST_GROUP.protected },
        {
          userRequestOptions: { authentication: MOCK_AUTH },
          isPortal: true,
        } as IArcGISContext
      );
      expect(chk.name).toBe("dev followers Content");
      expect(getUniqueGroupTitleSpy).toHaveBeenCalledTimes(1);
      expect(portalCreateGroupSpy).toHaveBeenCalledTimes(1);
      expect(portalProtectGroupSpy).toHaveBeenCalledTimes(1);
      expect(chk.protected).toBe(true);
    });
  });

  describe("fetchHubGroup", () => {
    it("fetches a HubGroup", async () => {
      const portalGetGroupSpy = vi
        .spyOn(PortalModule, "getGroup")
        .mockResolvedValue(TEST_GROUP as any);
      const chk = await HubGroupsModule.fetchHubGroup(GUID, {
        authentication: MOCK_AUTH,
        isPortal: false,
      });
      expect(chk.name).toBe("dev followers Content");
      expect(chk.description).toBe("dev followers Content summary");
      expect(chk.orgId).toBe(TEST_GROUP.orgId);
      expect(portalGetGroupSpy).toHaveBeenCalledTimes(1);
    });
    it("does not fetch settings if permissions invalid", async () => {
      const portalGetGroupSpy = vi
        .spyOn(PortalModule, "getGroup")
        .mockResolvedValue(TEST_GROUP as any);
      const chk = await HubGroupsModule.fetchHubGroup(GUID, {
        authentication: MOCK_AUTH,
        isPortal: true,
      });
      expect(chk.name).toBe("dev followers Content");
      expect(chk.description).toBe("dev followers Content summary");
      expect(chk.orgId).toBe(TEST_GROUP.orgId);
      expect(portalGetGroupSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateHubGroup", () => {
    it("updates a HubGroup", async () => {
      const createOrUpdateEntitySettingsSpy = vi
        .spyOn(
          createOrUpdateEntitySettingsModule,
          "createOrUpdateEntitySettings"
        )
        .mockResolvedValue({ id: "abc", settings: { discussions: {} } } as any);
      const portalUpdateGroupSpy = vi
        .spyOn(PortalModule, "updateGroup")
        .mockResolvedValue(TEST_HUB_GROUP as any);
      const chk = await HubGroupsModule.updateHubGroup(
        TEST_HUB_GROUP as IHubGroup,
        {
          requestOptions: { authentication: MOCK_AUTH },
          isPortal: false,
        } as IArcGISContext
      );
      expect(chk.name).toBe("A new hub group");
      expect(createOrUpdateEntitySettingsSpy).toHaveBeenCalledTimes(1);
      expect(portalUpdateGroupSpy).toHaveBeenCalledTimes(1);
    });
    it("updates membershipAccess: anyone", async () => {
      const createOrUpdateEntitySettingsSpy = vi
        .spyOn(
          createOrUpdateEntitySettingsModule,
          "createOrUpdateEntitySettings"
        )
        .mockResolvedValue({ id: "abc", settings: { discussions: {} } } as any);
      const portalUpdateGroupSpy = vi.spyOn(PortalModule, "updateGroup");
      const chk = await HubGroupsModule.updateHubGroup(
        { ...TEST_HUB_GROUP, membershipAccess: "anyone" } as IHubGroup,
        {
          requestOptions: { authentication: MOCK_AUTH },
          isPortal: false,
        } as IArcGISContext
      );
      expect(chk.membershipAccess).toBe("anyone");
      // If membershipAccess is "anyone", we will set
      // membershipAccess: null and clearEmptyFields: true
      // to the updateGroup call
      expect(createOrUpdateEntitySettingsSpy).toHaveBeenCalledTimes(1);
      const pcall = (portalUpdateGroupSpy as any).mock.calls[0][0];
      expect(pcall.group.membershipAccess).toBe("");
      expect(pcall.params.clearEmptyFields).toBeTruthy();
    });
    it("updates membershipAccess: organization", async () => {
      const createOrUpdateEntitySettingsSpy = vi
        .spyOn(
          createOrUpdateEntitySettingsModule,
          "createOrUpdateEntitySettings"
        )
        .mockResolvedValue({ id: "abc", settings: { discussions: {} } } as any);
      const portalUpdateGroupSpy = vi.spyOn(PortalModule, "updateGroup");
      const chk = await HubGroupsModule.updateHubGroup(
        { ...TEST_HUB_GROUP, membershipAccess: "organization" } as IHubGroup,
        {
          requestOptions: { authentication: MOCK_AUTH },
          isPortal: false,
        } as IArcGISContext
      );
      expect(chk.membershipAccess).toBe("organization");
      expect(createOrUpdateEntitySettingsSpy).toHaveBeenCalledTimes(1);
      const pcall2 = (portalUpdateGroupSpy as any).mock.calls[0][0];
      expect(pcall2.group.membershipAccess).toBe("org");
    });
    it("updates membershipAccess: collaborators", async () => {
      const createOrUpdateEntitySettingsSpy = vi
        .spyOn(
          createOrUpdateEntitySettingsModule,
          "createOrUpdateEntitySettings"
        )
        .mockResolvedValue({ id: "abc", settings: { discussions: {} } } as any);
      const portalUpdateGroupSpy = vi.spyOn(PortalModule, "updateGroup");
      const chk = await HubGroupsModule.updateHubGroup(
        { ...TEST_HUB_GROUP, membershipAccess: "collaborators" } as IHubGroup,
        {
          requestOptions: { authentication: MOCK_AUTH },
          isPortal: false,
        } as IArcGISContext
      );
      expect(chk.membershipAccess).toBe("collaborators");
      expect(createOrUpdateEntitySettingsSpy).toHaveBeenCalledTimes(1);
      const pcall3 = (portalUpdateGroupSpy as any).mock.calls[0][0];
      expect(pcall3.group.membershipAccess).toBe("collaboration");
    });
    it("does not set discussion settings if permissions invalid", async () => {
      const portalUpdateGroupSpy = vi
        .spyOn(PortalModule, "updateGroup")
        .mockResolvedValue(TEST_HUB_GROUP as any);
      const chk = await HubGroupsModule.updateHubGroup(
        TEST_HUB_GROUP as IHubGroup,
        {
          requestOptions: { authentication: MOCK_AUTH },
          isPortal: true,
        } as IArcGISContext
      );
      expect(chk.name).toBe("A new hub group");
      expect(portalUpdateGroupSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteHubGroup", () => {
    it("delete a HubGroup", async () => {
      const portalRemoveGroupSpy = vi
        .spyOn(PortalModule, "removeGroup")
        .mockResolvedValue({ success: true } as any);
      await HubGroupsModule.deleteHubGroup(TEST_HUB_GROUP.id, {
        authentication: MOCK_AUTH,
      });
      expect(portalRemoveGroupSpy).toHaveBeenCalledTimes(1);
    });
  });
});
