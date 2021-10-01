import { getTeamPropertiesMapForProduct } from "../../../src/teams/utils/get-team-properties-map-for-product";
import { HubProduct } from "../../../src";
describe("getTeamPropertiesMapForProduct", () => {
  it("should always return content and core", () => {
    const products: HubProduct[] = ["basic", "premium", "portal"];

    products.forEach((product) => {
      const map = getTeamPropertiesMapForProduct(product);
      expect(map.core).toBeDefined(`core returned for product ${product}`);
      expect(map.content).toBeDefined(`core returned for product ${product}`);
    });
  });

  it("should only return followers on premium", () => {
    const products: HubProduct[] = ["basic", "portal"];

    products.forEach((product) => {
      const map = getTeamPropertiesMapForProduct(product);
      expect(map.followers).not.toBeDefined(
        `followers should not be available on ${product}`
      );
    });

    expect(getTeamPropertiesMapForProduct("premium").followers).toBeDefined(
      "follower should be available on premium"
    );
  });
});
