import { HubProduct } from "@esri/hub-common";
import { getTeamsForProduct } from "../../src";

describe("getTeamsForProduct", () => {
  it("should always return content and core", () => {
    const products: HubProduct[] = ["basic", "premium", "portal"];

    products.forEach(product => {
      const teams = getTeamsForProduct(product);
      expect(teams).toContain("core", `core returned for product ${product}`);
      expect(teams).toContain(
        "content",
        `core returned for product ${product}`
      );
    });
  });

  it("should only return followers on premium", () => {
    const products: HubProduct[] = ["basic", "portal"];

    products.forEach(product => {
      const teams = getTeamsForProduct(product);
      expect(teams).not.toContain(
        "followers",
        `followers should not be available on ${product}`
      );
    });

    expect(getTeamsForProduct("premium")).toContain(
      "followers",
      "follower should be available on premium"
    );
  });
});
