import { getTeamsAvailableInProduct } from "../../src/utils/get-teams-available-in-product";

describe("getTeamsAvailableInProduct", () => {
  it("return teams for a specific product", () => {
    const chk = getTeamsAvailableInProduct("basic", "8.4");
    expect(Array.isArray(chk)).toBeTruthy(
      "should return array of team templates"
    );
    expect(chk.length).toBe(3, "should return 3 of team templates for basic");
  });
  it("return teams for a specific product in 9.1", () => {
    const chk = getTeamsAvailableInProduct("premium", "9.1");
    expect(Array.isArray(chk)).toBeTruthy(
      "should return array of team templates"
    );
    expect(chk.length).toBe(5, "should return 5 of team templates for basic");
    expect(chk[0].membershipAccess).toBe(
      "collaboration",
      "core team should be set to collaboration"
    );
    expect(chk[4].membershipAccess).toBe(
      "",
      "event team should be an empty string membershipAccess"
    );
  });
});
