import * as getOrgExtent from "../../src/extent";
import { getOrgExtentAsBBox } from "../../src/extent";
import { IHubRequestOptions } from "../../src/hub-types";
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

    jest
      .spyOn(getOrgExtent, "orgExtent")
      .mockReturnValue(Promise.resolve(getOrgExtent.GLOBAL_EXTENT));

    const result = await getOrgExtentAsBBox(requestOpts);

    const { xmin, ymin, xmax, ymax } = getOrgExtent.GLOBAL_EXTENT;
    expect(result).toEqual([
      [xmin, ymin],
      [xmax, ymax],
    ]);
  });
});
