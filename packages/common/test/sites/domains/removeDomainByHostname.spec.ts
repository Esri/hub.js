// we want to spy on these methods, so we need to import them
// from the same path that's used in the fn under test
import * as removeDomainModule from "../../../src/sites/domains/remove-domain";
import * as lookupDomainModule from "../../../src/sites/domains/lookup-domain";
import {
  MOCK_HUB_REQOPTS,
  MOCK_ENTERPRISE_REQOPTS,
} from "../../mocks/mock-auth";
import { removeDomainByHostname } from "../../../src/sites/domains/removeDomainByHostname";
import { getProp } from "../../../src/objects/get-prop";
import { vi } from "vitest";

describe("removeDomainByHostname:", () => {
  let lookupSpy: any;
  let removeSpy: any;
  beforeEach(() => {
    removeSpy = vi
      .spyOn(removeDomainModule, "removeDomain")
      .mockReturnValue(Promise.resolve() as any);
  });

  afterEach(() => vi.restoreAllMocks());

  it("removes domain thats found", async () => {
    lookupSpy = vi
      .spyOn(lookupDomainModule, "lookupDomain")
      .mockReturnValue(Promise.resolve({ id: 1234 }) as any);
    await removeDomainByHostname("fake.hostname.com", MOCK_HUB_REQOPTS);
    expect((lookupSpy ).mock.calls.length).toBe(1);
    expect((removeSpy ).mock.calls.length).toBe(1);
  });
  it("throws on portal", async () => {
    lookupSpy = vi
      .spyOn(lookupDomainModule, "lookupDomain")
      .mockReturnValue(Promise.resolve({ id: 1234 }) as any);
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
      expect((lookupSpy ).mock.calls.length).toBe(0);
      expect((removeSpy ).mock.calls.length).toBe(0);
    }
  });

  it("throws on error internally", async () => {
    lookupSpy = vi
      .spyOn(lookupDomainModule, "lookupDomain")
      .mockReturnValue(Promise.reject({ message: "blarg" }) as any);
    try {
      await removeDomainByHostname("fake.hostname.com", MOCK_HUB_REQOPTS);
    } catch (err) {
      expect(getProp(err, "name")).toBe("Error");
      expect(getProp(err, "message")).toContain(
        "Error removing domain entry for fake.hostname.com"
      );
      expect((lookupSpy ).mock.calls.length).toBe(1);
      expect((removeSpy ).mock.calls.length).toBe(0);
    }
  });

  it("skips domain not found", async () => {
    lookupSpy = vi
      .spyOn(lookupDomainModule, "lookupDomain")
      .mockReturnValue(Promise.resolve({}) as any);
    await removeDomainByHostname("fake.hostname.com", MOCK_HUB_REQOPTS);
    expect((lookupSpy ).mock.calls.length).toBe(1);
    expect((removeSpy ).mock.calls.length).toBe(0);
  });
});
