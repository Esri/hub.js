import { _lookupPortal } from "./_lookup-portal";
import { IHubRequestOptions } from "@esri/hub-common";

/**
 * Check if an item exists with the specified domain keyword
 * @param {String} domain domain to check for
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function domainExistsPortal(
  domain: string,
  hubRequestOptions: IHubRequestOptions
) {
  return _lookupPortal(domain, hubRequestOptions)
    .then(res => {
      return true;
    })
    .catch(_ => {
      return false;
    });
}
