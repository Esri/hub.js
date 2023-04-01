import { IPipeable } from "../utils";
import { fetchOrg } from "../org/fetch-org";
import { getItemOrgId } from "../content/_internal/getItemOrgId";
import { IItemAndEnrichments, handleEnrichmentError } from "./_enrichments";

// Note, this MUST be run after `enrichOwnerUser` to access the correct orgId during processing.
// `item.orgId` is only SOMETIMES returned by Portal, so we need the ownerUser's orgId as a backup.
//
// If an orgId isn't present on either the item or the ownerUser, this operation will be skipped.

export function enrichOrg(
  input: IPipeable<IItemAndEnrichments>
): Promise<IPipeable<IItemAndEnrichments>> {
  const { data, stack, requestOptions } = input;
  const opId = stack.start("enrichOrg");

  const orgId = getItemOrgId(data.item, data.ownerUser);

  // Only fetch the org if an explicit orgId is present
  const orgPromise = orgId
    ? fetchOrg(orgId, requestOptions)
    : Promise.resolve(undefined);
  return orgPromise
    .then((org) => {
      stack.finish(opId);
      return {
        data: { ...data, org },
        stack,
        requestOptions,
      };
    })
    .catch((error) => handleEnrichmentError(error, input, opId));
}
