import { ICreateOrgNotificationResult } from "@esri/arcgis-rest-portal";
import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { IAddMemberContext, IConsolidatedResult } from "./interfaces";
import { getWithDefault } from "@esri/hub-common";

/**
 * @private
 */
export function _consolidateResults(
  context: IAddMemberContext
): IConsolidatedResult {
  const {
    autoAddResult,
    inviteResult,
    primaryEmailResult,
    secondaryEmailResult
  } = context;

  let combinedEmailResults: ICreateOrgNotificationResult;
  if (primaryEmailResult || secondaryEmailResult) {
    const validResults = [primaryEmailResult, secondaryEmailResult].filter(
      r => r
    );
    const combinedSuccess = validResults.every(r => r.success);
    const combinedErrors: ArcGISRequestError[] = validResults.reduce(
      (collection, r) => collection.concat(getWithDefault(r, "errors", [])),
      []
    );
    combinedEmailResults = {
      success: combinedSuccess
    };
    if (combinedErrors.length) {
      combinedEmailResults.errors = combinedErrors;
    }
  }

  const overallSuccess = [autoAddResult, inviteResult, combinedEmailResults]
    .filter(r => r)
    .every(r => r.success);

  return {
    success: overallSuccess,
    autoAdd: autoAddResult,
    invite: inviteResult,
    email: combinedEmailResults
  };
}
