import { IHubRequestOptions, getOrgExtentAsBBox } from "../../src";
import * as getOrgExtent from "../../src/extent";
import { mockUserSession } from "../test-helpers/fake-user-session";

describe("getOrgExtentAsBBox", function () {
  it("gets the extent as a BBox", async function () {
    const requestOpts: IHubRequestOptions = {
      portalSelf: {
        user: {},
        id: "123",
        isPortal: false,
        name: "some-portal",
      },
      isPortal: false,
      hubApiUrl: "some-url",
      authentication: mockUserSession,
    };

    spyOn(getOrgExtent, "orgExtent").and.returnValue(
      Promise.resolve(getOrgExtent.GLOBAL_EXTENT)
    );

    const result = await getOrgExtentAsBBox(requestOpts);

    const { xmin, ymin, xmax, ymax } = getOrgExtent.GLOBAL_EXTENT;
    expect(result).toEqual([
      [xmin, ymin],
      [xmax, ymax],
    ]);
  });
});
