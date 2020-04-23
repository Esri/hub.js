import { getHubProduct } from "../../src";

describe("getHubProduct", function() {
  it("returns correct product", function() {
    const hubEnabledPortal = {
      portalProperties: {
        hub: {
          enabled: true
        }
      },
      isPortal: false
    };

    expect(getHubProduct(hubEnabledPortal)).toBe("premium");

    const hubBasicPortal = {
      portalProperties: {
        hub: {
          enabled: false
        }
      },
      isPortal: false
    };
    expect(getHubProduct(hubBasicPortal)).toBe("basic");

    const portalPortal = {
      portalProperties: {
        hub: {
          enabled: false
        }
      },
      isPortal: true,
      portalMode: "singletenant"
    };
    expect(getHubProduct(portalPortal)).toBe("portal");
  });
});
