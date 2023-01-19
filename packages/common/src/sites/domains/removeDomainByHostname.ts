// These will be spied on in tests
import { lookupDomain } from "./lookup-domain";
import { removeDomain } from "./remove-domain";

import { IHubRequestOptions } from "../../types";
import { getProp } from "../../objects";

/**
 * Remove an entry from the domain service, based on a hostname
 *
 * Callers must ensure the user is a member of the org that
 * owns the domain entry else the call will fail.
 * @param hostname
 * @param hubRequestOptions
 */
export async function removeDomainByHostname(
  hostname: string,
  hubRequestOptions: IHubRequestOptions
): Promise<void> {
  if (hubRequestOptions.isPortal) {
    throw new Error(
      `removeDomainByHostname is not available in ArcGIS Enterprise. Instead, edit the hubdomain typekeyword on the item`
    );
  }
  try {
    const domainEntry = await lookupDomain(hostname, hubRequestOptions);
    // Could consider doing a check here to verify that current user
    // is member of the org owning the domain record, but api will
    // enforce this.
    const id = getProp(domainEntry, "id");
    if (id) {
      await removeDomain(id, hubRequestOptions);
    }
  } catch (ex) {
    throw new Error(`Error removing domain entry for ${hostname}: ${ex}`);
  }
}
