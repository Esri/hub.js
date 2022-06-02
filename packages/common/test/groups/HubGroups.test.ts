import { IGroup } from "@esri/arcgis-rest-portal";

import {
  cloneObject,
  enrichGroupSearchResult,
  IHubRequestOptions,
} from "../../src";
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
      const itm = cloneObject(TEST_GROUP);
      delete itm.capabilities;
      const chk = await enrichGroupSearchResult(itm, [], hubRo);
      expect(chk.isSharedUpdate).toBe(false);
    });

    it("uses snippet if defined", async () => {
      const itm = cloneObject(TEST_GROUP);
      itm.snippet = "This should be used";
      const chk = await enrichGroupSearchResult(itm, [], hubRo);
      expect(chk.summary).toEqual(itm.snippet);
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
});
