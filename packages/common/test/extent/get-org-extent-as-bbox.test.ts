import { IHubRequestOptions, getOrgExtentAsBBox } from "../../src";
import * as getOrgExtent from "../../src/extent/get-geographic-org-extent";

describe("getOrgExtentAsBBox", function() {
  it("gets the extent as a BBox", async function() {
    const requestOpts: IHubRequestOptions = {
      portalSelf: {
        user: {},
        id: "123",
        isPortal: false,
        name: "some-portal"
      },
      isPortal: false,
      hubApiUrl: "some-url"
    };

    spyOn(getOrgExtent, "getGeographicOrgExtent").and.returnValue(
      Promise.resolve(getOrgExtent.GLOBAL_EXTENT)
    );

    const result = await getOrgExtentAsBBox(requestOpts);

    const { xmin, ymin, xmax, ymax } = getOrgExtent.GLOBAL_EXTENT;
    expect(result).toEqual([[xmin, ymin], [xmax, ymax]]);
  });
});
