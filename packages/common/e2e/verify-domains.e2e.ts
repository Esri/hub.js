import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import {
  HubSite,
  IHubSite,
  cloneObject,
  ensureUniqueDomainName,
  getDomainsForSite,
  getPortalApiUrl,
} from "../src";
import { IRequestOptions, request } from "@esri/arcgis-rest-request";

describe("verify domain updates:", () => {
  let factory: Artifactory;
  const orgName = "hubPremium";
  beforeAll(() => {
    factory = new Artifactory(config, "devext");
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });
  it("create site, verify domain, remove site", async () => {
    const ctxMgr = await factory.getContextManager(orgName, "admin");
    const tmpl: Partial<IHubSite> = cloneObject(defaultSite);
    const site = await HubSite.create(tmpl, ctxMgr.context, true);

    try {
      // verify domain
      const domains = await getDomainsForSite(
        site.id,
        ctxMgr.context.hubRequestOptions
      );
      expect(domains.length).toBe(1);
      const siteJson = site.toJson();
      expect(domains[0].hostname).toBe(siteJson.defaultHostname);

      // update domain which should update the redirectUris
      siteJson.subdomain = await ensureUniqueDomainName(
        "e2e-updated-site",
        ctxMgr.context.hubRequestOptions
      );
      siteJson.defaultHostname = `${siteJson.subdomain}.hubdev.arcgis.com`;
      site.update(siteJson);
      await site.save();
      // verify domain is updated
      const domains2 = await getDomainsForSite(
        site.id,
        ctxMgr.context.hubRequestOptions
      );
      expect(domains2.length).toBe(1);
      expect(domains2[0].hostname).toBe(siteJson.defaultHostname);

      // verify redirectUris on the site item
      const info = await getAppInfo(
        siteJson.clientId,
        ctxMgr.context.hubRequestOptions
      );
      expect(info.redirect_uris.length).toBe(1);
      expect(info.redirect_uris[0]).toBe(
        `https://${siteJson.defaultHostname}/`
      );
    } catch (error) {
      throw error;
    } finally {
      // remove site
      await site.delete();
      // verify domain entry is removed
      const domains3 = await getDomainsForSite(
        site.id,
        ctxMgr.context.hubRequestOptions
      );
      expect(domains3.length).toBe(0);
    }
  });
});

function getAppInfo(
  clientId: string,
  requestOptions: IRequestOptions
): Promise<any> {
  const url = `${getPortalApiUrl(requestOptions)}/oauth2/apps/${clientId}`;
  const options = {
    authentication: requestOptions.authentication,
  };
  return request(url, options);
}

const defaultSite: Partial<IHubSite> = {
  name: "e2e site",
  description: "e2e site description",
  defaultHostname: "e2e-site-dev-pre-hub.hubdev.arcgis.com",
  subdomain: "e2e-site-dev-pre-hub",
  orgUrlKey: "dev-pre-hub",
  type: "Hub Site Application",
};
