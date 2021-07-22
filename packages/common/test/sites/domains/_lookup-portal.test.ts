import * as portalModule from "@esri/arcgis-rest-portal";
import { _lookupPortal } from "../../../src/sites/domains";
import { IHubRequestOptions } from "../../../src/types";

describe("_lookupPortal", function () {
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

    const searchItemsSpy = spyOn(portalModule, "searchItems").and.returnValue(
      Promise.resolve(sitesResponse)
    );

    const res = await _lookupPortal(domain, {} as IHubRequestOptions);

    expect(portalModule.searchItems).toHaveBeenCalled();
    expect(searchItemsSpy.calls.argsFor(0)[0].q).toBe(
      `typekeywords: hubsubdomain|${domain}`
    );
    expect(res).toEqual(portal);
  });

  it("looks up a portal", async function () {
    const domain = "this-should-get-cut-off/#/foobar";
    const sitesResponse: { results: any[] } = {
      results: [],
    };

    const searchItemsSpy = spyOn(portalModule, "searchItems").and.returnValue(
      Promise.resolve(sitesResponse)
    );

    try {
      await _lookupPortal(domain, {} as IHubRequestOptions);
      fail("should have rejected");
    } catch (err) {
      expect(err).toBeDefined();
    }

    expect(portalModule.searchItems).toHaveBeenCalled();
    expect(searchItemsSpy.calls.argsFor(0)[0].q).toBe(
      `typekeywords: hubsubdomain|foobar`
    );
  });
});
