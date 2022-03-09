import { _removeSiteDomains } from "../src";
import * as commonModule from "@esri/hub-common";
import { IHubRequestOptions } from "@esri/hub-common";

describe("_removeSiteDomains", () => {
  let removeDomainsBySiteIdSpy: jasmine.Spy;

  beforeEach(() => {
    removeDomainsBySiteIdSpy = spyOn(commonModule, "removeDomainsBySiteId");
  });

  afterEach(() => {
    removeDomainsBySiteIdSpy.calls.reset();
  });
  it("removes the domains", async () => {
    removeDomainsBySiteIdSpy.and.returnValue(
      Promise.resolve([{ id: "foo" }, { id: "baz" }, { id: "bar" }])
    );

    const ro = {} as IHubRequestOptions;
    const siteId = "foobarbaz";

    const res = await _removeSiteDomains(siteId, ro);

    expect(res.length).toEqual(3, "removed correct number of domains");
    expect(removeDomainsBySiteIdSpy.calls.count()).toBe(
      1,
      "removeDomainsBySiteId called correct number of times"
    );

    expect(removeDomainsBySiteIdSpy.calls.argsFor(0)[0]).toBe("foobarbaz");
  });

  it("does nothing on portal", async function () {
    removeDomainsBySiteIdSpy.and.returnValue(Promise.resolve({}));

    const ro = { isPortal: true } as IHubRequestOptions;
    const siteId = "foobarbaz";

    const res = await _removeSiteDomains(siteId, ro);

    expect(res).toEqual([]);
    expect(removeDomainsBySiteIdSpy).not.toHaveBeenCalled();
  });
});
