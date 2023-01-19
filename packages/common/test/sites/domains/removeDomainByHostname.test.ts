// we want to spy on these methods, so we need to import them
// from the same path that's used in the fn under test
import * as removeDomainModule from "../../../src/sites/domains/remove-domain";
import * as lookupDomainModule from "../../../src/sites/domains/lookup-domain";
import { getProp, removeDomainByHostname } from "../../../src";
import {
  MOCK_HUB_REQOPTS,
  MOCK_ENTERPRISE_REQOPTS,
} from "../../mocks/mock-auth";

describe("removeDomainByHostname:", () => {
  let lookupSpy: jasmine.Spy;
  let removeSpy: jasmine.Spy;
  beforeEach(() => {
    removeSpy = spyOn(removeDomainModule, "removeDomain").and.returnValue(
      Promise.resolve()
    );
  });

  it("removes domain thats found", async () => {
    lookupSpy = spyOn(lookupDomainModule, "lookupDomain").and.returnValue(
      Promise.resolve({
        id: 1234,
      })
    );
    await removeDomainByHostname("fake.hostname.com", MOCK_HUB_REQOPTS);
    expect(lookupSpy.calls.count()).toBe(1);
    expect(removeSpy.calls.count()).toBe(1);
  });
  it("throws on portal", async () => {
    lookupSpy = spyOn(lookupDomainModule, "lookupDomain").and.returnValue(
      Promise.resolve({
        id: 1234,
      })
    );
    try {
      await removeDomainByHostname(
        "fake.hostname.com",
        MOCK_ENTERPRISE_REQOPTS
      );
    } catch (err) {
      expect(getProp(err, "name")).toBe("Error");
      expect(getProp(err, "message")).toContain(
        "removeDomainByHostname is not available in ArcGIS Enterprise."
      );
      expect(lookupSpy.calls.count()).toBe(0);
      expect(removeSpy.calls.count()).toBe(0);
    }
  });

  it("throws on error internally", async () => {
    lookupSpy = spyOn(lookupDomainModule, "lookupDomain").and.returnValue(
      Promise.reject({
        message: "blarg",
      })
    );
    try {
      await removeDomainByHostname("fake.hostname.com", MOCK_HUB_REQOPTS);
    } catch (err) {
      expect(getProp(err, "name")).toBe("Error");
      expect(getProp(err, "message")).toContain(
        "Error removing domain entry for fake.hostname.com"
      );
      expect(lookupSpy.calls.count()).toBe(1);
      expect(removeSpy.calls.count()).toBe(0);
    }
  });

  it("skips domain not found", async () => {
    lookupSpy = spyOn(lookupDomainModule, "lookupDomain").and.returnValue(
      Promise.resolve({})
    );
    await removeDomainByHostname("fake.hostname.com", MOCK_HUB_REQOPTS);
    expect(lookupSpy.calls.count()).toBe(1);
    expect(removeSpy.calls.count()).toBe(0);
  });
});
