import { describe, it, expect, vi, afterEach } from "vitest";
import type { IPortal, IUser } from "@esri/arcgis-rest-portal";
import * as FetchOrgModule from "../../../src/org/fetch-org";
import { fetchUserEnrichments } from "../../../src/users/_internal/enrichments";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as SimpleResponse from "../../mocks/portal/simple-response.json";
import { cloneObject } from "../../../src/util";
import {
  IEnrichmentErrorInfo,
  IHubRequestOptions,
} from "../../../src/hub-types";

describe("user enrichments:", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("org enrichment", async () => {
    const getPortalSpy = vi
      .spyOn(FetchOrgModule as any, "fetchOrg")
      .mockResolvedValue(cloneObject(SimpleResponse));

    const user = {
      username: "vader",
      orgId: "ATCRG96GAegBiycU",
    } as unknown as IUser;
    const ro = {
      portal: "https://devext.arcgis.com/sharing/rest",
      authentication: MOCK_AUTH,
    } as IHubRequestOptions;

    const chk = await fetchUserEnrichments(user, ["org"], ro);

    expect(chk.org).toBeDefined();
    expect(chk.org).toEqual(cloneObject(SimpleResponse) as unknown as IPortal);

    // spy args
    expect(getPortalSpy).toHaveBeenCalledTimes(1);
    const [id, reqOpts] = (getPortalSpy as any).mock.calls[0];
    expect(id).toBe(user.orgId);
    expect(reqOpts.portal).toBe("https://devext.arcgis.com/sharing/rest");
  });

  it("org enrichment with no orgId returns null", async () => {
    const user = {
      username: "vader",
    } as unknown as IUser;
    const ro = {
      portal: "https://devext.arcgis.com/sharing/rest",
      authentication: MOCK_AUTH,
    } as IHubRequestOptions;

    const chk = await fetchUserEnrichments(user, ["org"], ro);
    expect(chk.org).toBeNull();
  });

  describe("errors:", () => {
    it("org enrichment", async () => {
      vi.spyOn(FetchOrgModule as any, "fetchOrg").mockRejectedValue(
        new Error("get portal failed")
      );

      const user = {
        username: "vader",
        orgId: "ATCRG96GAegBiycU-OTHER",
      } as unknown as IUser;
      const ro = {
        portal: "https://devext.arcgis.com/sharing/rest",
        authentication: MOCK_AUTH,
      } as IHubRequestOptions;

      const chk = await fetchUserEnrichments(user, ["org"], ro);

      expect(chk.errors).toBeDefined();
      expect(chk.errors?.length).toBe(1);
      const errs = chk.errors || [];
      expect(errs[0]).toEqual({
        type: "Other",
        message: "get portal failed",
      } as IEnrichmentErrorInfo);
    });
  });
});
