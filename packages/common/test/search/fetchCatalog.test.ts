import { IHubRequestOptions } from "../../src";
import { fetchCatalog } from "../../src/search/fetchCatalog";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as PortalModule from "@esri/arcgis-rest-portal";
import * as DomainModule from "../../src/sites/domains/lookup-domain";

describe("fetchCatalog:", () => {
  it("throws if not passed a url or guid", async () => {
    const hro: IHubRequestOptions = {
      authentication: MOCK_AUTH,
    };
    try {
      await fetchCatalog("wat", hro);
    } catch (err) {
      expect(err.name).toBe("HubError");
      expect(err.message).toBe("Identifier must be a url, guid");
    }
  });

  it("looks up domain, fetches item, upgrades schema", async () => {
    const hro: IHubRequestOptions = {
      authentication: MOCK_AUTH,
    };
    // spies
    const lookupDomainSpy = spyOn(DomainModule, "lookupDomain").and.callFake(
      () => {
        return Promise.resolve({ siteId: "3ef" });
      }
    );
    const getItemDataSpy = spyOn(PortalModule, "getItemData").and.callFake(
      () => {
        return Promise.resolve({ catalog: { groups: ["00c"] } });
      }
    );

    const chk = await fetchCatalog("https://mysite.com/foo/bar", hro);
    // verify response
    expect(chk.schemaVersion).toBe(1);
    expect(chk.scopes?.item).toBeDefined();
    expect(chk.scopes?.item?.filters.length).toBe(2);
    // verify calls
    expect(lookupDomainSpy.calls.count()).toBe(1);
    const [url, hroParam] = lookupDomainSpy.calls.argsFor(0);
    expect(url).toBe("mysite.com");

    expect(getItemDataSpy.calls.count()).toBe(1);
    const [id, opts] = getItemDataSpy.calls.argsFor(0);
    expect(id).toBe("3ef");
  });

  it("domain lookup; no catalog defined", async () => {
    const hro: IHubRequestOptions = {
      authentication: MOCK_AUTH,
    };
    // spies
    const lookupDomainSpy = spyOn(DomainModule, "lookupDomain").and.callFake(
      () => {
        return Promise.resolve({ siteId: "3ef" });
      }
    );
    const getItemDataSpy = spyOn(PortalModule, "getItemData").and.callFake(
      () => {
        return Promise.resolve({});
      }
    );

    const chk = await fetchCatalog(
      "https://myserver.com/gis/apps/sites/#/some-site",
      hro
    );
    // verify response
    expect(chk.schemaVersion).toBe(1);
    expect(chk.scopes?.item).toBeDefined();
    expect(chk.scopes?.item?.filters.length).toBe(1);
    // verify calls
    expect(lookupDomainSpy.calls.count()).toBe(1);
    const [url, hroParam] = lookupDomainSpy.calls.argsFor(0);
    expect(url).toBe("myserver.com/gis/apps/sites/#/some-site");

    expect(getItemDataSpy.calls.count()).toBe(1);
    const [id, opts] = getItemDataSpy.calls.argsFor(0);
    expect(id).toBe("3ef");
  });

  it("looks up by id", async () => {
    const hro: IHubRequestOptions = {
      authentication: MOCK_AUTH,
    };
    const getItemDataSpy = spyOn(PortalModule, "getItemData").and.callFake(
      () => {
        return Promise.resolve({ catalog: { groups: ["00c"] } });
      }
    );

    const chk = await fetchCatalog("119a6a4051e24a0d956b3006bc2e4bb7", hro);
    // verify response
    expect(chk.schemaVersion).toBe(1);
    expect(chk.scopes?.item).toBeDefined();
    expect(chk.scopes?.item?.filters.length).toBe(2);
    // verify calls
    expect(getItemDataSpy.calls.count()).toBe(1);
    const [id, opts] = getItemDataSpy.calls.argsFor(0);
    expect(id).toBe("119a6a4051e24a0d956b3006bc2e4bb7");
  });
  it("looks up by id; no catalog", async () => {
    const hro: IHubRequestOptions = {
      authentication: MOCK_AUTH,
    };
    const getItemDataSpy = spyOn(PortalModule, "getItemData").and.callFake(
      () => {
        return Promise.resolve({});
      }
    );

    const chk = await fetchCatalog("119a6a4051e24a0d956b3006bc2e4bb7", hro);
    // verify response
    expect(chk.schemaVersion).toBe(1);
    expect(chk.scopes?.item).toBeDefined();
    expect(chk.scopes?.item?.filters.length).toBe(1);
    // verify calls
    expect(getItemDataSpy.calls.count()).toBe(1);
    const [id, opts] = getItemDataSpy.calls.argsFor(0);
    expect(id).toBe("119a6a4051e24a0d956b3006bc2e4bb7");
  });
});
