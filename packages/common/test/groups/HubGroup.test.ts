import { IGroup } from "@esri/arcgis-rest-portal";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import {
  ArcGISContextManager,
  cloneObject,
  createHubGroup,
  enrichGroupSearchResult,
  HubGroup,
  IHubRequestOptions,
} from "../../src";
import * as HubGroupsModule from "../../src/groups/HubGroups";
import * as FetchEnrichments from "../../src/groups/_internal/enrichments";

const TEST_GROUP: IGroup = {
  id: "23b988acd113446798b0db7a11d27a56",
  title: "dev followers Content",
  isInvitationOnly: false,
  owner: "dev_pre_hub_admin",
  description: "dev followers Content",
  snippet: null,
  tags: ["Hub Initiative Group", "Open Data"],
  typeKeywords: [],
  phone: null,
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

describe("HubGroup class:", () => {
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

  describe("createHubGroup", () => {
    it("creates a HubGroup", async () => {
      const createSpy = spyOn(HubGroupsModule, "createHubGroup").and.callFake(
        (group: IGroup) => {
          group.id = "3ef";
          return Promise.resolve(group);
        }
      );
      const chk = await HubGroup.create(
        { name: "Test Group" },
        authdCtxMgr.context
      );
      await chk.save();
      expect(createSpy).toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Group");
      const json = chk.toJson();
      // expect(json.permissions).toEqual([]);
    });
  });
});
