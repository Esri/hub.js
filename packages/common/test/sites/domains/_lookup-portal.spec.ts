// Ensure the arcgis-rest-portal module is mocked before importing the module-under-test
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  searchItems: vi.fn(),
}));

import * as portalModule from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../../../src/hub-types";
import { _lookupPortal } from "../../../src/sites/domains/_lookup-portal";
import { vi } from "vitest";

describe("_lookupPortal", function () {
  afterEach(() => vi.restoreAllMocks());

  it("looks up a portal", async function () {
    const portal = {
      hostname: "mysite",
      siteId: "mysiteid",
    };
    const domain = "foobar";
    const sitesResponse = {
      results: [
        {
          url: portal.hostname,
          id: portal.siteId,
          typeKeywords: ["hubsubdomain|foobar"],
        },
      ],
    };

    const searchItemsSpy = vi
      .spyOn(portalModule, "searchItems")
      .mockReturnValue(Promise.resolve(sitesResponse) as any);

    const res = await _lookupPortal(domain, {} as IHubRequestOptions);

    expect(portalModule.searchItems).toHaveBeenCalled();
    expect((searchItemsSpy as any).mock.calls[0][0].q).toBe(
      `typekeywords: hubsubdomain|${domain}`
    );
    expect(res).toEqual(portal);
  });

  it("looks up a portal (and handles truncated domain)", async function () {
    const domain = "this-should-get-cut-off/#/foobar";
    const sitesResponse: { results: any[] } = {
      results: [],
    };

    const searchItemsSpy = vi
      .spyOn(portalModule, "searchItems")
      .mockReturnValue(Promise.resolve(sitesResponse) as any);

    await expect(
      _lookupPortal(domain, {} as IHubRequestOptions)
    ).rejects.toBeDefined();

    expect(portalModule.searchItems).toHaveBeenCalled();
    expect((searchItemsSpy as any).mock.calls[0][0].q).toBe(
      `typekeywords: hubsubdomain|foobar`
    );
  });
});
