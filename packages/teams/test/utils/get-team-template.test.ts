import { getTeamTemplate } from "../../src/utils/get-team-template";
import { HubProduct, HubTeamType } from "../../src/types";

describe("getTeamTemplate", () => {
  it("it returns nothing for invalid product or team", function() {
    expect(
      getTeamTemplate("fake" as HubTeamType, "basic", "8.4")
    ).toBeUndefined("should return undefined if invalid team");
    expect(getTeamTemplate("core", "foo" as HubProduct, "8.4")).toBeUndefined(
      "should return undefined if invalid product"
    );
  });

  it("it returns the correct template", function() {
    const chk = getTeamTemplate("content", "portal", "8.4");
    expect(chk.config.groupType).toBe(
      "Portal Content Group",
      "should return the correct group"
    );
  });
});
