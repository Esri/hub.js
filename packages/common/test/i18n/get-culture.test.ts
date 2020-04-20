import { getCulture, IHubRequestOptions } from "../../src";

describe("getCulture", function() {
  it("gets the culture from hub request options with proper defaults", function() {
    const ro: IHubRequestOptions = {
      isPortal: false,
      hubApiUrl: ""
    };
    expect(getCulture(ro)).toBe(
      "en-us",
      "defaults to en-us when user.culture, portal.culture not available"
    );

    ro.portalSelf = {
      name: "",
      id: "",
      isPortal: false,
      culture: "fr"
    };
    expect(getCulture(ro)).toBe(
      "fr",
      "defaults to portal.culture when user.culture not available"
    );

    ro.portalSelf.user = { culture: "zh" };
    expect(getCulture(ro)).toBe("zh", "uses user.culture when available");
  });
});
