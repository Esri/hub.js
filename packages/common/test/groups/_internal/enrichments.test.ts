import { fetchGroupEnrichments } from "../../../src/groups/_internal/enrichments";
import * as Portal from "@esri/arcgis-rest-portal";
import * as SimpleGroupContentResponse from "../../mocks/portal-groups-search/simple-response.json";
import * as SimpleGroupUserResponse from "../../mocks/portal-group-user-search/simple-response.json";
import * as SimpleGroupResponse from "../../mocks/portal-get-group/simple-response.json";
import {
  cloneObject,
  IEnrichmentErrorInfo,
  IHubRequestOptions,
} from "../../../src";

describe("group enrichments:", () => {
  it("memberCount enrichment", async () => {
    const groupMemberSearchSpy = spyOn(Portal, "searchGroupUsers").and.callFake(
      () => {
        return Promise.resolve(cloneObject(SimpleGroupUserResponse));
      }
    );

    const grp = { id: "3ef" } as unknown as Portal.IGroup;
    const ro = {
      portal: "https://devext.arcgis.com/sharing/rest",
    } as IHubRequestOptions;
    const chk = await fetchGroupEnrichments(grp, ["membershipSummary"], ro);

    expect(chk.membershipSummary).toBeDefined();
    expect(chk.membershipSummary.total).toBe(1);
    expect(chk.membershipSummary.users.length).toBe(1);

    // spy args
    expect(groupMemberSearchSpy.calls.count()).toBe(
      1,
      "should call searchGroupUsers"
    );
    const [groupId, expectedParams] = groupMemberSearchSpy.calls.argsFor(0);
    expect(groupId).toBe("3ef");
    expect(expectedParams.num).toBe(3);
    expect(expectedParams.portal).toBe(ro.portal);
  });

  it("contentCount enrichment", async () => {
    const groupContentSearchSpy = spyOn(
      Portal,
      "searchGroupContent"
    ).and.callFake(() => {
      return Promise.resolve(cloneObject(SimpleGroupContentResponse));
    });

    const grp = { id: "3ef" } as unknown as Portal.IGroup;
    const ro = {
      portal: "https://devext.arcgis.com/sharing/rest",
    } as IHubRequestOptions;
    const chk = await fetchGroupEnrichments(grp, ["contentCount"], ro);

    expect(chk.contentCount).toBeDefined();
    expect(groupContentSearchSpy.calls.count()).toBe(
      1,
      "should call searchGroupContent"
    );
    const [expectedParams] = groupContentSearchSpy.calls.argsFor(0);
    expect(expectedParams.groupId).toBe("3ef");
    expect(expectedParams.num).toBe(1);
    expect(expectedParams.portal).toBe(ro.portal);
  });

  it("userMembership enrichment", async () => {
    const getGroupSpy = spyOn(Portal, "getGroup").and.callFake(() => {
      return Promise.resolve(cloneObject(SimpleGroupResponse));
    });

    const grp = { id: "3ef" } as unknown as Portal.IGroup;
    const ro = {
      portal: "https://devext.arcgis.com/sharing/rest",
    } as IHubRequestOptions;
    const chk = await fetchGroupEnrichments(grp, ["userMembership"], ro);

    expect(chk.userMembership).toEqual("owner");
    expect(chk.membershipAccess).toEqual("org");

    // spy args
    expect(getGroupSpy.calls.count()).toBe(1, "should call getGroup");
    const [groupId, expectedParams] = getGroupSpy.calls.argsFor(0);
    expect(groupId).toBe("3ef");
    expect(expectedParams.portal).toBe(ro.portal);
  });

  describe("errors:", () => {
    it("memberCount enrichment", async () => {
      spyOn(Portal, "searchGroupUsers").and.callFake(() => {
        return Promise.reject(new Error("group member search failed"));
      });

      const grp = { id: "3ef" } as unknown as Portal.IGroup;
      const ro = {
        portal: "https://devext.arcgis.com/sharing/rest",
      } as IHubRequestOptions;

      const chk = await fetchGroupEnrichments(grp, ["membershipSummary"], ro);

      expect(chk.errors).toBeDefined();
      expect(chk.errors.length).toBe(1);
      expect(chk.errors[0]).toEqual({
        type: "Other",
        message: "group member search failed",
      } as IEnrichmentErrorInfo);
    });

    it("contentCount enrichment", async () => {
      spyOn(Portal, "searchGroupContent").and.callFake(() => {
        return Promise.reject(new Error("group content search failed"));
      });

      const grp = { id: "3ef" } as unknown as Portal.IGroup;
      const ro = {
        portal: "https://devext.arcgis.com/sharing/rest",
      } as IHubRequestOptions;
      const chk = await fetchGroupEnrichments(grp, ["contentCount"], ro);

      expect(chk.errors).toBeDefined();
      expect(chk.errors.length).toBe(1);
      expect(chk.errors[0]).toEqual({
        type: "Other",
        message: "group content search failed",
      } as IEnrichmentErrorInfo);
    });

    it("userMembership enrichment", async () => {
      spyOn(Portal, "getGroup").and.callFake(() => {
        return Promise.reject(new Error("get group failed"));
      });

      const grp = { id: "3ef" } as unknown as Portal.IGroup;
      const ro = {
        portal: "https://devext.arcgis.com/sharing/rest",
      } as IHubRequestOptions;
      const chk = await fetchGroupEnrichments(grp, ["userMembership"], ro);

      expect(chk.errors).toBeDefined();
      expect(chk.errors.length).toBe(1);
      expect(chk.errors[0]).toEqual({
        type: "Other",
        message: "get group failed",
      } as IEnrichmentErrorInfo);
    });
  });
});
