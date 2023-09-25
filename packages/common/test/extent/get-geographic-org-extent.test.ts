import * as request from "@esri/arcgis-rest-request";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { IHubRequestOptions, orgExtent, GLOBAL_EXTENT } from "../../src";
import { IRequestOptions } from "@esri/arcgis-rest-request";

describe("orgExtent", function () {
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

    const requestSpy = spyOn(request, "request").and.returnValue(
      Promise.resolve({
        geometries: [geom],
      })
    );

    const result = await orgExtent(requestOpts);

    expect(result.xmax).toBe(geom.xmax, "correct xmax");
    expect(result.ymax).toBe(geom.ymax, "correct ymax");
    expect(result.xmin).toBe(geom.xmin, "correct xmin");
    expect(result.ymin).toBe(geom.ymin, "correct ymin");
    expect(result.spatialReference.wkid).toBe(4326, "Correct WKID");

    // const options: IRequestOptions = {
    //   httpMethod: 'POST',
    //   params: {
    //     geometries: JSON.stringify(geometryParam),
    //     transformForward: false,
    //     transformation: '',
    //     inSR: orgExtent.spatialReference.wkid,
    //     outSR: 4326,
    //     f: 'json'
    //   },
    // };

    expect(requestSpy.calls.count()).toBe(1, "request called once");
    const requestArgs = requestSpy.calls.argsFor(0);
    const requestUrl = requestArgs[0];
    const requestOptions: IRequestOptions = requestArgs[1];

    expect(requestUrl).toBe(`${geometryServiceUrl}/project`);
    expect(requestOptions.httpMethod).toBe("POST", "used post");
    expect(requestOptions.params.transformForward).toBe(
      false,
      "transformForward is false"
    );
    expect(requestOptions.params.inSR).toBe(
      orgWkid,
      "used correct in-reference"
    );
    expect(requestOptions.params.outSR).toBe(
      4326,
      "used correct out-reference"
    );
    expect(requestOptions.params.f).toBe("json", "requested json format");
    expect(requestOptions.authentication).toEqual(
      mockUserSession,
      "attached auth manager"
    );
    expect(requestOptions.params.geometries).toEqual(
      '{"geometryType":"esriGeometryEnvelope","geometries":[{"spatialReference":{"wkid":1423}}]}',
      "geometries properly serialized"
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

    const requestSpy = spyOn(request, "request").and.returnValue(
      Promise.resolve({
        geometries: [geom],
      })
    );

    const result = await orgExtent(optsWithoutOrgExtent);

    expect(requestSpy.calls.count()).toBe(0, "request not called");
    expect(result).toEqual(GLOBAL_EXTENT, "resolved to global extent");

    requestSpy.calls.reset();
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

    expect(requestSpy.calls.count()).toBe(0, "request not called");
    expect(result2).toEqual(GLOBAL_EXTENT, "resolved to global extent");
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

    const requestSpy = spyOn(request, "request").and.returnValue(
      Promise.reject(Error("network request failed"))
    );

    const result = await orgExtent(optsWithoutOrgExtent);

    expect(requestSpy.calls.count()).toBe(1, "request called");
    expect(result).toEqual(GLOBAL_EXTENT, "resolved to global extent");
  });
});
