import * as restPortal from "@esri/arcgis-rest-portal";
import { IPortal } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { fetchOrg } from "../../src";

describe("fetchOrg", () => {
  let getPortalStub: any;
  const orgId = "9001";
  const mockPortal = {
    orgId,
    name: "test",
  } as unknown as IPortal;
  beforeEach(() => {
    getPortalStub = spyOn(restPortal, "getPortal").and.returnValue(
      Promise.resolve(mockPortal)
    );
  });
  it("Derives base portal from options.portal", async () => {
    const mockAuth = { portal: "authentication-portal.mapsdevext.arcgis.com" };
    const requestOptions = {
      portal: "top-level-portal.mapsqa.arcgis.com",
      authentication: mockAuth,
    } as unknown as IRequestOptions;

    const result = await fetchOrg(orgId, requestOptions);
    expect(getPortalStub).toHaveBeenCalledWith(orgId, {
      portal: "https://qaext.arcgis.com/sharing/rest",
      authentication: mockAuth,
    });
    expect(result).toBe(mockPortal);
  });
  it("Derives base portal from option.authentication.portal", async () => {
    const mockAuth = { portal: "authentication-portal.mapsdevext.arcgis.com" };
    const requestOptions = {
      authentication: mockAuth,
    } as unknown as IRequestOptions;

    await fetchOrg(orgId, requestOptions);
    expect(getPortalStub).toHaveBeenCalledWith(orgId, {
      portal: "https://devext.arcgis.com/sharing/rest",
      authentication: mockAuth,
    });
  });
  it("Defaults to www.arcgis.com", async () => {
    await fetchOrg(orgId);
    expect(getPortalStub).toHaveBeenCalledWith(orgId, {
      portal: "https://www.arcgis.com/sharing/rest",
    });
  });
});
