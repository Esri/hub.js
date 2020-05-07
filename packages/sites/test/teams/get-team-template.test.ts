import { getTeamTemplate, HubProduct, HubTeamType } from "../../src";

describe("getTeamTemplate", () => {
  it("it returns nothing for invalid product or team", function() {
    expect(getTeamTemplate("fake" as HubTeamType, "basic")).toBeUndefined(
      "should return undefined if invalid team"
    );
    expect(getTeamTemplate("core", "foo" as HubProduct)).toBeUndefined(
      "should return undefined if invalid product"
    );
  });

  it("it returns the correct template", function() {
    const chk = getTeamTemplate("content", "portal");
    expect(chk.config.groupType).toBe(
      "Portal Content Group",
      "should return the correct group"
    );
  });
});
