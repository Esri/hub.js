import { searchItems } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { includes } from "@esri/hub-common";

/**
 * Lookup a domain in Portal
 * @param {string} hostname to locate the site for
 * @param {IHubRequestOptions} hubRequestOptions
 * @private
 */
export function _lookupPortal(
  hostname: string,
  requestOptions: IRequestOptions
): Promise<{ hostname: string; siteId: string }> {
  // for portal we search for a site w/ `hubsubdomain|<domain>` type keyword
  let subdomain = hostname;
  // if this subdomain has a hash in it, knock that off
  if (hostname.indexOf("#/") > -1) {
    subdomain = hostname.split("#/")[1];
  }

  const queryTerm = `hubsubdomain|${subdomain}`;
  const opts = Object.assign(
    {
      q: `typekeywords: ${queryTerm}`
    },
    requestOptions
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
