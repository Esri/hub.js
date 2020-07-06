import { _removeSiteDomains } from "../src";
import * as domainsModule from "../src/domains";
import { IHubRequestOptions } from "@esri/hub-common";

describe("_removeSiteDomains", () => {
  it("removes the domains", async () => {
    const removeSpy = spyOn(domainsModule, "removeDomain").and.returnValue(
      Promise.resolve({})
    );

    spyOn(domainsModule, "getDomainsForSite").and.returnValue(
      Promise.resolve([{ id: "foo" }, { id: "baz" }, { id: "bar" }])
    );

    const ro = {} as IHubRequestOptions;
    const siteId = "foobarbaz";

    const res = await _removeSiteDomains(siteId, ro);

    expect(res.length).toEqual(3, "removed correct number of domains");
    expect(removeSpy.calls.count()).toBe(
      3,
      "removeDomain called correct number of times"
    );

    // check the ids
    expect(removeSpy.calls.argsFor(0)[0]).toBe("foo");
    expect(removeSpy.calls.argsFor(1)[0]).toBe("baz");
    expect(removeSpy.calls.argsFor(2)[0]).toBe("bar");
  });

  it("does nothing on portal", async function() {
    const removeSpy = spyOn(domainsModule, "removeDomain").and.returnValue(
      Promise.resolve({})
    );

    spyOn(domainsModule, "getDomainsForSite").and.returnValue(
      Promise.resolve([{ id: "foo" }, { id: "baz" }, { id: "bar" }])
    );

    const ro = { isPortal: true } as IHubRequestOptions;
    const siteId = "foobarbaz";

    const res = await _removeSiteDomains(siteId, ro);

    expect(res).toEqual([]);
    expect(removeSpy).not.toHaveBeenCalled();
    expect(domainsModule.getDomainsForSite).not.toHaveBeenCalled();
  });
});
