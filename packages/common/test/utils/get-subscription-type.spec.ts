import { getSubscriptionType } from "../../src/utils/get-subscription-type";
import type { IPortal } from "@esri/arcgis-rest-portal";

describe("getSubscriptionType", () => {
  it("returns the subscription type when present", () => {
    const portalSelf = {
      subscriptionInfo: { type: "Standard" },
    } as unknown as IPortal;
    expect(getSubscriptionType(portalSelf)).toBe("Standard");
  });

  it("returns 'Enterprise' when subscriptionInfo.type is missing", () => {
    const portalSelf = {} as IPortal;
    expect(getSubscriptionType(portalSelf)).toBe("Enterprise");
  });

  it("returns 'Enterprise' when subscriptionInfo is present but type is missing", () => {
    const portalSelf = {
      subscriptionInfo: {},
    } as unknown as IPortal;
    expect(getSubscriptionType(portalSelf)).toBe("Enterprise");
  });
});
