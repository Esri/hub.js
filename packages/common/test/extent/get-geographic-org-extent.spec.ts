import { vi, afterEach, describe, it, expect } from "vitest";

// Mock the arcgis-rest-request module so its 'request' export is a mock function
vi.mock("@esri/arcgis-rest-request", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...(original as any),
    request: vi.fn(),
  };
});

import * as request from "@esri/arcgis-rest-request";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubRequestOptions } from "../../src/hub-types";
import { GLOBAL_EXTENT, orgExtent } from "../../src/extent";

describe("orgExtent", function () {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches extent when geometryServiceUrl and orgExtent are provided", async function () {
    const geom = {
      xmin: 132,
      ymin: 435,
      xmax: 429,
      ymax: 192,
    };

    const geometryServiceUrl = "geometry-service-url";
    const orgWkid = 1423;
    const requestOpts: IHubRequestOptions = {
      portalSelf: {
        user: {},
        id: "123",
        isPortal: false,
        name: "some-portal",
        defaultExtent: {
          spatialReference: {
            wkid: orgWkid,
          },
        },
        helperServices: {
          geometry: {
            url: geometryServiceUrl,
          },
        },
      },
      isPortal: false,
      hubApiUrl: "some-url",
      authentication: mockUserSession,
    };

    const requestSpy = request.request as unknown as ReturnType<typeof vi.fn>;
    requestSpy.mockResolvedValue({ geometries: [geom] });

    const result = await orgExtent(requestOpts);

    expect(result.xmax).toBe(geom.xmax);
    expect(result.ymax).toBe(geom.ymax);
    expect(result.xmin).toBe(geom.xmin);
    expect(result.ymin).toBe(geom.ymin);
    expect(result.spatialReference.wkid).toBe(4326);

    expect(requestSpy).toHaveBeenCalledTimes(1);
    const requestArgs = (requestSpy as any).mock.calls[0];
    const requestUrl = requestArgs[0];
    const requestOptions: IRequestOptions = requestArgs[1];

    expect(requestUrl).toBe(`${geometryServiceUrl}/project`);
    expect(requestOptions.httpMethod).toBe("POST");
    expect(requestOptions.params.transformForward).toBe(false);
    expect(requestOptions.params.inSR).toBe(orgWkid);
    expect(requestOptions.params.outSR).toBe(4326);
    expect(requestOptions.params.f).toBe("json");
    expect(requestOptions.authentication).toEqual(mockUserSession);
    expect(requestOptions.params.geometries).toEqual(
      '{"geometryType":"esriGeometryEnvelope","geometries":[{"spatialReference":{"wkid":1423}}]}'
    );
  });

  it("returns global extent when geometryServiceUrl or orgExtent are absent", async function () {
    const geom = {
      xmin: 132,
      ymin: 435,
      xmax: 429,
      ymax: 192,
    };

    const optsWithoutOrgExtent: IHubRequestOptions = {
      portalSelf: {
        user: {},
        id: "123",
        isPortal: false,
        name: "some-portal",
        helperServices: {
          geometry: {
            url: "some-url",
          },
        },
      },
      isPortal: false,
      hubApiUrl: "some-url",
      authentication: mockUserSession,
    };

    const requestSpy = request.request as unknown as ReturnType<typeof vi.fn>;
    requestSpy.mockResolvedValue({ geometries: [geom] });

    const result = await orgExtent(optsWithoutOrgExtent);

    expect(requestSpy).toHaveBeenCalledTimes(0);
    expect(result).toEqual(GLOBAL_EXTENT);

    (requestSpy as any).mockReset?.();
    const optsWithoutGeoUrl: IHubRequestOptions = {
      portalSelf: {
        user: {},
        id: "123",
        isPortal: false,
        name: "some-portal",
        defaultExtent: {
          spatialReference: {
            wkid: 1234,
          },
        },
        helperServices: {
          geometry: {},
        },
      },
      isPortal: false,
      hubApiUrl: "some-url",
      authentication: mockUserSession,
    };

    const result2 = await orgExtent(optsWithoutGeoUrl);

    expect(requestSpy).toHaveBeenCalledTimes(0);
    expect(result2).toEqual(GLOBAL_EXTENT);
  });

  it("returns global extent when network call fails", async function () {
    const optsWithoutOrgExtent: IHubRequestOptions = {
      portalSelf: {
        user: {},
        id: "123",
        isPortal: false,
        name: "some-portal",
        defaultExtent: {
          spatialReference: {
            wkid: 1234,
          },
        },
        helperServices: {
          geometry: {
            url: "some-url",
          },
        },
      },
      isPortal: false,
      hubApiUrl: "some-url",
      authentication: null,
    };

    const requestSpy = request.request as unknown as ReturnType<typeof vi.fn>;
    requestSpy.mockRejectedValue(Error("network request failed"));

    const result = await orgExtent(optsWithoutOrgExtent);

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(GLOBAL_EXTENT);
  });
});
