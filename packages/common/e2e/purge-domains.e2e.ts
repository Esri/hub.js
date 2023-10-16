import { getItem } from "@esri/arcgis-rest-portal";
import {
  lookupDomain,
  deleteSite,
  removeDomain,
  IArcGISContext,
  failSafe,
} from "../src";
let count = 0;
async function processDomain(cfg: {
  domain: string;
  context: IArcGISContext;
}): Promise<{ domain: string; state: string[] }> {
  const result = {
    domain: cfg.domain,
    state: [] as string[],
  };
  // setup the functions with failsafe so we dont rely on try/catch
  const fsLookupDomain = failSafe(lookupDomain, null);
  const fsGetItem = failSafe(getItem, null);
  const fsDeleteSite = failSafe(deleteSite, null);
  const fsRemoveDomain = failSafe(removeDomain, null);
  // get the domain record
  const domainInfo = await fsLookupDomain(
    cfg.domain,
    cfg.context.hubRequestOptions
  );
  if (domainInfo) {
    // try to get the item
    result.state.push(`${cfg.domain}: domain exists`);
    const siteItem = await fsGetItem(
      domainInfo.siteId,
      cfg.context.requestOptions
    );
    if (siteItem) {
      result.state.push(`${cfg.domain}: site item exists`);
      // console.log(`Site item ${siteItem.id} exists - removing`);
      // got the site item
      // delete the site
      await fsDeleteSite(siteItem.id, cfg.context.requestOptions);
      // delete the domain
      await fsRemoveDomain(domainInfo.id, cfg.context.hubRequestOptions);
    } else {
      result.state.push(`${cfg.domain}: site item does not exist`);
      // no site item
      // remove the domain
      await fsRemoveDomain(domainInfo.id, cfg.context.hubRequestOptions);
    }
    // verify domain is gone
    // const chk = await fsLookupDomain(
    //   config.domain,
    //   config.context.hubRequestOptions
    // );
    // if (chk) {
    //   result.state.push(`${config.domain}: domain not removed`);
    //   console.warn(`Domain ${config.domain} is still exists`);
    // } else {
    //   result.state.push(`${config.domain}: domain removed `);
    // }
  } else {
    // no domain record
    result.state.push(`${cfg.domain}: domain record does not exist  `);
  }
  count++;
  // console.log(`Processed ${count} domains`);
  return result;
}

// describe("Purge Orphan Domains", () => {
//   let factory: Artifactory;
//   let contexts: any;
//   beforeAll(async () => {
//     factory = new Artifactory(config);
//     jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000000000;
//     // create sessions for the orgs in a hash
//     contexts = {};

//     const premiumCtxMgr = await factory.getContextManager(
//       "hubPremium",
//       "admin"
//     );
//     const basicCtxMgr = await factory.getContextManager("hubBasic", "admin");

//     contexts["qa-pre-hub"] = premiumCtxMgr.context;
//     contexts["qa-bas-hub"] = basicCtxMgr.context;
//   });

//   it("iterates domain entries", async () => {
//     // need to do this in batches so we don't DDOS the API
//     // TODO: Batch this
//     const configs = hostnames.map((hostname) => {
//       const info = {
//         domain: `${hostname}.hubqa.arcgis.com`,
//         context: contexts["qa-bas-hub"],
//       };
//       if (hostname.indexOf("qa-pre-hub") > -1) {
//         info.context = contexts["qa-pre-hub"];
//       }
//       return info;
//     });

//     const start = 0; // 12000 + 19941 + 27058 + 1066 + 50000 + 50000 + 120000 + 1740;
//     const end = configs.length - start;
//     console.info(`Total: ${configs.length}, start: ${start} to ${end}`);
//     const toProcess = configs.slice(start, start + end);
//     console.log(`Processing ${toProcess.length} domains`);
//     const results = (await batch(toProcess, processDomain, 8)) as {
//       domain: string;
//       state: string[];
//     }[];
//     console.log(results);
//     console.log(`Done.`);
//     // results.map((result) => {
//     //   console.log(`------------------`);
//     //   console.log(`Actions for ${result.domain}`);
//     //   result.state.map((state) => {
//     //     console.log(state);
//     //   });
//     // });
//   });
// });
