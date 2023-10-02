import {
  addDomain,
  domainExistsPortal,
  domainExists,
  ensureUniqueDomainName,
  getDomainsForSite,
  getUniqueDomainNamePortal,
  getUniqueDomainName,
  isDomainForLegacySite,
  isDomainUsedElsewhere,
  isValidDomain,
  lookupDomain,
  removeDomain,
  updateDomain,
} from "../../src";

describe("proxy domain exports", () => {
  it("they are all defined", () => {
    [
      addDomain,
      domainExistsPortal,
      domainExists,
      ensureUniqueDomainName,
      getDomainsForSite,
      getUniqueDomainNamePortal,
      getUniqueDomainName,
      isDomainForLegacySite,
      isDomainUsedElsewhere,
      isValidDomain,
      lookupDomain,
      removeDomain,
      updateDomain,
    ].forEach((fn) => expect(fn).toBeDefined());
  });
});
