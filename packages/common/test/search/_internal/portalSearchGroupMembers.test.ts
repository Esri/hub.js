import { IHubSearchOptions, IQuery, cloneObject } from "../../../src";
import { portalSearchGroupMembers } from "../../../src/search/_internal/portalSearchGroupMembers";
import * as Portal from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as users from "../../../src/users";

describe("portalSearchGroupMembers:", () => {
  describe("throws if not passed group:", () => {
    let qry: IQuery;
    beforeEach(() => {
      qry = {
        targetEntity: "groupMember",
        filters: [
          {
            predicates: [
              {
                name: "steve",
              },
            ],
          },
        ],
      };
    });
    it("no properties passed", async () => {
      const opts: IHubSearchOptions = {};
      try {
        await portalSearchGroupMembers(qry, opts);
      } catch (err) {
        expect(err.message).toEqual(
          "Group Id required. Please pass as a predicate in the query."
        );
      }
    });
    it("passing query.properties", async () => {
      const opts: IHubSearchOptions = {};
      const cloneQry = cloneObject(qry);
      cloneQry.filters[0].predicates.push({ group: { any: ["3ef"] } });
      try {
        await portalSearchGroupMembers(qry, opts);
      } catch (err) {
        expect(err.message).toEqual(
          "Group Id required. Please pass as a predicate in the query."
        );
      }
    });
  });
  describe("executes search:", () => {
    let qry: IQuery;
    beforeEach(() => {
      qry = {
        targetEntity: "groupMember",
        filters: [
          {
            predicates: [
              {
                name: "steve",
                remove: "property",
              },
              {
                memberType: "admin",
              },
            ],
          },
        ],
      };
    });
    it("simple search", async () => {
      const searchSpy = spyOn(Portal, "searchGroupUsers").and.callFake(() => {
        return Promise.resolve(cloneObject(GroupMembersResponse));
      });
      const userSpy = spyOn(Portal, "getUser").and.callFake((options: any) => {
        const resp = cloneObject(SparseUser);
        resp.username = options.username;
        return Promise.resolve(resp);
      });
      // NOTE: enrichUserSearchResult is tested elsewhere so we don't assert on the results here
      const enrichUserSearchResultSpy = spyOn(
        users,
        "enrichUserSearchResult"
      ).and.callThrough();
      const opts: IHubSearchOptions = {
        num: 2,
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
          authentication: MOCK_AUTH,
        },
      };
      const cloneQry = cloneObject(qry);
      cloneQry.filters[0].predicates.push({ group: "3ef" });
      const response = await portalSearchGroupMembers(cloneQry, opts);
      // validate spy calls
      expect(searchSpy.calls.count()).toBe(1, "should call searchGroupUsers");
      expect(userSpy.calls.count()).toBe(2, "should get each user");
      expect(enrichUserSearchResultSpy.calls.count()).toBe(
        2,
        "should enrich each user"
      );
      // validate call args
      const groupId = searchSpy.calls.argsFor(0)[0];
      expect(groupId).toBe("3ef");
      const callOpts = searchSpy.calls.argsFor(
        0
      )[1] as Portal.ISearchGroupUsersOptions;
      expect(callOpts.memberType).toBe("admin");
      expect(callOpts.name).toBe("steve");
      expect(callOpts.remove).not.toBeDefined();
      expect(response.results.length).toBe(2);
      const user1 = response.results[0];
      expect(user1.owner).toBe("e2e_pre_hub_c_member");
      expect(user1.orgId).not.toBeDefined();
      expect(user1.orgName).not.toBeDefined();
      expect(user1.memberType).toBe("admin");
      expect(user1.family).toBe("people");
    });
    it("accepts IMatchOptions: any", async () => {
      const searchSpy = spyOn(Portal, "searchGroupUsers").and.callFake(() => {
        return Promise.resolve(cloneObject(GroupMembersResponse));
      });
      spyOn(Portal, "getUser").and.callFake((options: any) => {
        const resp = cloneObject(SparseUser);
        resp.username = options.username;
        return Promise.resolve(resp);
      });
      // NOTE: enrichUserSearchResult is tested elsewhere so we don't assert on the results here
      spyOn(users, "enrichUserSearchResult").and.callThrough();
      const opts: IHubSearchOptions = {
        num: 2,
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
          authentication: MOCK_AUTH,
        },
      };
      const cloneQry = cloneObject(qry);
      cloneQry.filters[0].predicates.push({ group: { any: ["3ef", "fff"] } });
      await portalSearchGroupMembers(cloneQry, opts);
      // validate call args
      const groupId = searchSpy.calls.argsFor(0)[0];
      expect(groupId).toBe("3ef");
    });
    it("accepts IMatchOptions: all", async () => {
      const searchSpy = spyOn(Portal, "searchGroupUsers").and.callFake(() => {
        return Promise.resolve(cloneObject(GroupMembersResponse));
      });
      spyOn(Portal, "getUser").and.callFake((options: any) => {
        const resp = cloneObject(SparseUser);
        resp.username = options.username;
        return Promise.resolve(resp);
      });
      // NOTE: enrichUserSearchResult is tested elsewhere so we don't assert on the results here
      spyOn(users, "enrichUserSearchResult").and.callThrough();
      const opts: IHubSearchOptions = {
        num: 2,
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
          authentication: MOCK_AUTH,
        },
      };
      const cloneQry = cloneObject(qry);
      cloneQry.filters[0].predicates.push({ group: { all: ["3ef", "00c"] } });
      await portalSearchGroupMembers(cloneQry, opts);
      // validate call args
      const groupId = searchSpy.calls.argsFor(0)[0];
      expect(groupId).toBe("3ef");
    });
    it("search without auth", async () => {
      const searchSpy = spyOn(Portal, "searchGroupUsers").and.callFake(() => {
        return Promise.resolve(cloneObject(SparseGroupMembersResponse));
      });
      const userSpy = spyOn(Portal, "getUser").and.callFake((options: any) => {
        const resp = cloneObject(SparseUser);
        resp.username = options.username;
        return Promise.resolve(resp);
      });
      // NOTE: enrichUserSearchResult is tested elsewhere so we don't assert on the results here
      const enrichUserSearchResultSpy = spyOn(
        users,
        "enrichUserSearchResult"
      ).and.callThrough();
      const opts: IHubSearchOptions = {
        num: 2,
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
        },
      };
      const cloneQry = cloneObject(qry);
      cloneQry.filters[0].predicates.push({ group: ["3ef"] });
      const response = await portalSearchGroupMembers(cloneQry, opts);
      // validate spy calls
      expect(searchSpy.calls.count()).toBe(1, "should call searchGroupUsers");
      expect(userSpy.calls.count()).toBe(2, "should get each user");
      expect(enrichUserSearchResultSpy.calls.count()).toBe(
        2,
        "should enrich each user"
      );
      // validate call args
      const groupId = searchSpy.calls.argsFor(0)[0];
      expect(groupId).toBe("3ef");
      const callOpts = searchSpy.calls.argsFor(
        0
      )[1] as Portal.ISearchGroupUsersOptions;
      expect(callOpts.memberType).toBe("admin");
      expect(callOpts.name).toBe("steve");
      expect(response.results.length).toBe(2);
      const user1 = response.results[0];

      expect(user1.owner).toBe("e2e_pre_hub_c_member");
      expect(user1.orgId).not.toBeDefined();
      expect(user1.orgName).not.toBeDefined();
      expect(user1.memberType).toBe("admin");
      expect(user1.family).toBe("people");
    });
  });
});

const SparseUser: Portal.IUser = {
  username: "e2e_pre_hub_c_member",
  udn: null,
  id: "726f96ef603b4551a1fb76fa99f68364",
  fullName: "ArcGIS HubE2E",
  firstName: "ArcGIS",
  lastName: "HubE2E",
  description: null,
  tags: ["org:Q05waIVQNYv92Kgz", "hubRole:participant"],
  culture: "",
  cultureFormat: "",
  region: "US",
  units: "english",
  thumbnail: null,
  access: "public",
  created: 1569441945000,
  modified: 1569442018000,
  provider: "arcgis",
} as unknown as Portal.IUser;

const GroupMembersResponse = {
  total: 2,
  start: 1,
  num: 25,
  nextStart: -1,
  owner: {
    username: "e2e_pre_pub_admin",
    fullName: "e2e_pre_pub_admin qa-pre-hub",
  },
  users: [
    {
      username: "e2e_pre_hub_c_member",
      fullName: "ArcGIS HubE2E",
      memberType: "admin",
      thumbnail: "bozo.jpg",
      joined: 1575308050000,
      orgId: "Q05waIVQNYv92Kgz",
    },
    {
      username: "e2e_pre_pub_admin",
      fullName: "e2e_pre_pub_admin qa-pre-hub",
      memberType: "admin",
      thumbnail: "user.jpg",
      joined: 1575308011000,
      orgId: "T5cZDlfUaBpDnk6P",
    },
  ],
};

const SparseGroupMembersResponse = {
  total: 2,
  start: 1,
  num: 25,
  nextStart: -1,
  owner: {
    username: "e2e_pre_pub_admin",
  },
  users: [
    {
      username: "e2e_pre_hub_c_member",
      fullName: "ArcGIS HubE2E",
      memberType: "admin",
      thumbnail: "user.jpg",
      joined: 1575308050000,
    },
    {
      username: "e2e_pre_pub_admin",
      joined: 1575308011000,
    },
  ],
};
const MinimalUser: Portal.IUser = {
  username: "e2e_pre_pub_admin",
  udn: null,
  id: "e9604305b2bf44b1bac01bc78e08d768",
  fullName: "",
  firstName: "",
  lastName: "",
  created: 1563455713000,
  modified: 1676495017000,
  provider: "arcgis",
} as unknown as Portal.IUser;

const FullUser: Portal.IUser = {
  username: "e2e_pre_pub_admin",
  udn: null,
  id: "e9604305b2bf44b1bac01bc78e08d768",
  fullName: "e2e_pre_pub_admin qa-pre-hub",
  categories: [],
  emailStatus: "verified",
  emailStatusDate: 1685553302000,
  firstName: "e2e_pre_pub_admin",
  lastName: "qa-pre-hub",
  preferredView: null,
  description: null,
  email: "dbouwman@esri.com",
  userType: "arcgisonly",
  idpUsername: null,
  favGroupId: "21b609dac1784585a27ab55a99c09b37",
  lastLogin: 1687895393000,
  mfaEnabled: false,
  storageUsage: 10192336326,
  storageQuota: 2199023255552,
  orgId: "T5cZDlfUaBpDnk6P",
  role: "org_admin",
  privileges: [
    "premium:user:networkanalysis:servicearea",
    "premium:user:networkanalysis:vehiclerouting",
    "premium:user:places",
    "premium:user:spatialanalysis",
  ],
  level: "2",
  userLicenseTypeId: "creatorUT",
  disabled: false,
  tags: [],
  culture: "",
  cultureFormat: "",
  region: "US",
  units: null,
  thumbnail: null,
  access: "private",
  created: 1563455713000,
  modified: 1676495017000,
  provider: "arcgis",
  groups: [
    {
      id: "00d83db970ee4937b23d5bbf60c92b51",
      title: "collaborative-events-toggle-1628047171191 Core Team",
      isInvitationOnly: false,
      owner: "qa_pre_hub_admin",
      description:
        "Adding members to the core team adds them to this group. These team members are also added to the initiative's content and followers groups so they can edit and manage initiative items in the content group as well as view and send email updates to followers. This group is an update group which means that your team members can update its content. Other members of your ArcGIS Online organization can see this group, but only your team can see what it includes and make changes.<br /><br />If you have additional questions about the core team group, please see Esri documentation or contact support.<br /><br /><strong>DO NOT DELETE THIS GROUP.</strong>",
      snippet:
        "Members of this group can create, edit, and manage the site, pages, and other content related to collaborative-events-toggle-harness-1.",
      tags: [
        "Hub Group",
        "Hub Initiative Group",
        "Hub Site Group",
        "Hub Core Team Group",
        "Hub Team Group",
      ],
      typeKeywords: [],
      phone: null,
      sortField: "modified",
      sortOrder: "desc",
      isViewOnly: false,
      featuredItemsId: null,
      thumbnail: null,
      created: 1612556050000,
      modified: 1628047181000,
      access: "org",
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
      membershipAccess: "collaboration",
      displaySettings: {
        itemTypes: "",
      },
      properties: null,
      userMembership: {
        username: "e2e_pre_pub_admin",
        memberType: "admin",
        applications: 0,
      },
    },
  ],
} as unknown as Portal.IUser;
