import { getTeamsAvailableInProduct } from "../../src/utils/get-teams-available-in-product";

describe("getTeamsAvailableInProduct", () => {
  it("return teams for a specific product", () => {
    const chk = getTeamsAvailableInProduct("basic");
    expect(Array.isArray(chk)).toBeTruthy(
      "should return array of team templates"
    );
    expect(chk.length).toBe(3, "should return 3 of team templates for basic");
  });
});
