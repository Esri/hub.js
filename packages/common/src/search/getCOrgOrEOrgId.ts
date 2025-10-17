import { IHubTrustedOrgsResponse } from "../hub-types";
import { IArcGISContext } from "../types/IArcGISContext";

/**
 * Get the c-org or e-org ID. Defaults to the communityOrgId if the user is currently authed into
 * an e-org; otherwise it looks up the trusted org relationship to get the e-org id
 * @param context IArcGISContext
 * @returns orgid of the c-org or e-org
 */
export function getCOrgOrEOrgId(context: IArcGISContext): string {
  // extract the c-org / e-org relationship
  const cOrgEOrgTrustedRelationship = context.trustedOrgs.find(
    (org: IHubTrustedOrgsResponse) =>
      org.from.orgId === context.currentUser.orgId
  );

  // if we're in a community org, and there is a trusted org
  // relationship, use the orgId from there (which would be
  // the e-org id). Otherwise, use the c-org id
  return context.isCommunityOrg && cOrgEOrgTrustedRelationship
    ? cOrgEOrgTrustedRelationship.to.orgId
    : context.communityOrgId;
}
