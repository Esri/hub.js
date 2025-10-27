import { describe, it, expect } from "vitest";
import { IHubRequestOptions } from "../../src/hub-types";
import { getCulture } from "../../src/i18n/get-culture";
import { mockUserSession } from "../test-helpers/fake-user-session";

describe("getCulture", function () {
  it("gets the culture from hub request options with proper defaults", function () {
    const ro: IHubRequestOptions = {
      isPortal: false,
      hubApiUrl: "",
      authentication: mockUserSession,
    };
    expect(getCulture(ro)).toBe("en-us");

    ro.portalSelf = {
      name: "",
      id: "",
      isPortal: false,
      culture: "fr",
    };
    expect(getCulture(ro)).toBe("fr");

    ro.portalSelf.user = { culture: "zh" };
    expect(getCulture(ro)).toBe("zh");
  });
});
