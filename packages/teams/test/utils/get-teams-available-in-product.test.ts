import { getTeamsAvailableInProduct } from "../../src/utils/get-teams-available-in-product";

describe("getTeamsAvailableInProduct", () => {
  it("return teams for a specific product", () => {
    const chk = getTeamsAvailableInProduct("basic");
    expect(Array.isArray(chk)).toBeTruthy(
      "should return array of team templates"
    );
    expect(chk.length).toBe(3, "should return 3 of team templates for basic");
  });
  it("return teams for a specific product in 9.1", () => {
    const chk = getTeamsAvailableInProduct("premium");
    expect(Array.isArray(chk)).toBeTruthy(
      "should return array of team templates"
    );
    expect(chk.length).toBe(6, "should return 5 of team templates for premium");
    expect(chk[0].membershipAccess).toBe(
      "org",
      "core team should be set to org" // it gets updated to collaboration via getUserCreatableTeams
    );
    expect(chk[5].membershipAccess).toBe(
      "",
      "event team should be an empty string membershipAccess"
    );
  });
});
