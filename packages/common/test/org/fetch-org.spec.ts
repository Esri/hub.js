vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  return { ...(await importOriginal()), getPortal: vi.fn() };
});

import * as restPortal from "@esri/arcgis-rest-portal";
import { IPortal } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { fetchOrg } from "../../src/org/fetch-org";

describe("fetchOrg", () => {
  const orgId = "9001";
  const mockPortal = {
    orgId,
    name: "test",
  } as unknown as IPortal;

  beforeEach(() => {
    // set the mocked implementation on the module-level mock
    (restPortal.getPortal as unknown as any).mockResolvedValue(mockPortal);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Derives base portal from options.portal", async () => {
    const mockAuth = {
      portal:
        "https://authentication-portal.mapsdevext.arcgis.com/sharing/rest",
    };
    const requestOptions = {
      portal: "top-level-portal.mapsqa.arcgis.com",
      authentication: mockAuth,
    } as unknown as IRequestOptions;

    const result = await fetchOrg(orgId, requestOptions);
    expect(restPortal.getPortal).toHaveBeenCalledWith(orgId, {
      portal: "https://qaext.arcgis.com/sharing/rest",
      authentication: mockAuth,
    });
    expect(result).toBe(mockPortal);
  });

  it("Derives base portal from option.authentication.portal", async () => {
    const mockAuth = {
      portal:
        "https://authentication-portal.mapsdevext.arcgis.com/sharing/rest",
    };
    const requestOptions = {
      authentication: mockAuth,
    } as unknown as IRequestOptions;

    await fetchOrg(orgId, requestOptions);
    expect(restPortal.getPortal).toHaveBeenCalledWith(orgId, {
      portal: "https://devext.arcgis.com/sharing/rest",
      authentication: mockAuth,
    });
  });

  it("Derives base portal from option.authentication.portal for Enterprise", async () => {
    const mockAuth = {
      portal: "https://gis.fortcollins.com/portal/sharing/rest",
    };
    const requestOptions = {
      authentication: mockAuth,
    } as unknown as IRequestOptions;

    await fetchOrg(orgId, requestOptions);
    expect(restPortal.getPortal).toHaveBeenCalledWith(orgId, {
      portal: "https://gis.fortcollins.com/portal/sharing/rest",
      authentication: mockAuth,
    });
  });

  it("Defaults to www.arcgis.com", async () => {
    await fetchOrg(orgId);
    expect(restPortal.getPortal).toHaveBeenCalledWith(orgId, {
      portal: "https://www.arcgis.com/sharing/rest",
    });
  });
});
