import { searchItems } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions, includes } from "@esri/hub-common";

/**
 * Lookup a domain in Portal
 * @param {string} domain Domain to locate the site for
 * @param {IHubRequestOptions} hubRequestOptions
 * @private
 */
export function _lookupPortal(
  domain: string,
  hubRequestOptions: IHubRequestOptions
): Promise<{ hostname: string; siteId: string }> {
  // for portal we search for a site w/ `hubsubdomain|<domain>` type keyword
  let subdomain = domain;
  // if this subdomain has a hash in it, knock that off
  if (domain.indexOf("#/") > -1) {
    subdomain = domain.split("#/")[1];
  }

  const queryTerm = `hubsubdomain|${subdomain}`;
  const opts = Object.assign(
    {
      q: `typekeywords: ${queryTerm}`
    },
    hubRequestOptions
  );
  return searchItems(opts)
    .then(res => {
      // since the search api stems the terms, we need to verify
      // by looking at the results
      return res.results.filter(r => {
        return includes(r.typeKeywords, queryTerm);
      })[0];
    })
    .then(site => {
      if (!site) throw new Error("site not found");
      return {
        hostname: site.url,
        siteId: site.id
      };
    });
}
