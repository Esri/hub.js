import * as Portal from "@esri/arcgis-rest-portal";
import * as FetchOrgModule from "../../../src/org/fetch-org";
import {
  cloneObject,
  IEnrichmentErrorInfo,
  IHubRequestOptions,
} from "../../../src";
import { fetchUserEnrichments } from "../../../src/users/_internal/enrichments";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as SimpleResponse from "../../mocks/portal/simple-response.json";

describe("user enrichments:", () => {
  it("org enrichment", async () => {
    const getPortalSpy = spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve(cloneObject(SimpleResponse));
    });

    const user = {
      username: "vader",
      orgId: "ATCRG96GAegBiycU",
    } as unknown as Portal.IUser;
    const ro = {
      portal: "https://devext.arcgis.com/sharing/rest",
      authentication: MOCK_AUTH,
    } as IHubRequestOptions;

    const chk = await fetchUserEnrichments(user, ["org"], ro);

    expect(chk.org).toBeDefined();
    expect(chk.org).toEqual(SimpleResponse as unknown as Portal.IPortal);

    // spy args
    expect(getPortalSpy.calls.count()).toBe(1, "should call getPortal");
    const [id, reqOpts] = getPortalSpy.calls.argsFor(0);
    expect(id).toBe(user.orgId);
    expect(reqOpts.portal).toBe("https://devext.arcgis.com/sharing/rest");
  });

  describe("errors:", () => {
    it("org enrichment", async () => {
      spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
        return Promise.reject(new Error("get portal failed"));
      });

      const user = {
        username: "vader",
        orgId: "ATCRG96GAegBiycU-OTHER",
      } as unknown as Portal.IUser;
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
