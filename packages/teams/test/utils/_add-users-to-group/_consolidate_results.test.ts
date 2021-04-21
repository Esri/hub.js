import {
  IInviteGroupUsersResult,
  ICreateOrgNotificationResult
} from "@esri/arcgis-rest-portal";
import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { cloneObject } from "@esri/hub-common";
import {
  _consolidateResults,
  IAddMemberContext,
  IConsolidatedResult
} from "../../../src/utils/_add-users-to-group";

describe("_consolidateResults", () => {
  const baseContext: IAddMemberContext = {
    groupId: "Capsule Corp",
    allUsers: [],
    usersToAutoAdd: [],
    usersToEmail: [],
    usersToInvite: [],
    requestingUser: null,
    primaryRO: null
  };

  it("Properly creates a successful response", () => {
    const context = cloneObject(baseContext);
    context.autoAddResult = { success: true };
    context.inviteResult = { success: true };

    const actual = _consolidateResults(context);
    const expected: IConsolidatedResult = {
      success: true,
      autoAdd: { success: true },
      invite: { success: true },
      email: undefined
    };
    expect(actual).toEqual(expected);
  });

  it("Properly creates a failed response", () => {
    const inviteResponse: IInviteGroupUsersResult = {
      success: true
    };
    const primaryEmailError = new ArcGISRequestError("Primary email not sent");
    const secondaryEmailError = new ArcGISRequestError(
      "Secondary email not sent"
    );

    const context = cloneObject(baseContext);
    context.inviteResult = inviteResponse;
    context.primaryEmailResult = {
      success: false,
      errors: [primaryEmailError]
    };
    context.secondaryEmailResult = {
      success: false,
      errors: [secondaryEmailError]
    };

    const actual = _consolidateResults(context);
    const expected: IConsolidatedResult = {
      success: false,
      autoAdd: undefined,
      invite: inviteResponse,
      email: {
        success: false,
        errors: [primaryEmailError, secondaryEmailError]
      }
    };
    expect(actual).toEqual(expected);
  });

  it("Properly handles when one email response is null", () => {
    const inviteResponse: IInviteGroupUsersResult = {
      success: true
    };
    const secondaryEmailResult: ICreateOrgNotificationResult = {
      success: false,
      errors: [new ArcGISRequestError("Secondary email not sent")]
    };

    const context = cloneObject(baseContext);
    context.inviteResult = inviteResponse;
    context.secondaryEmailResult = secondaryEmailResult;

    const actual = _consolidateResults(context);
    const expected: IConsolidatedResult = {
      success: false,
      autoAdd: undefined,
      invite: inviteResponse,
      email: secondaryEmailResult
    };
    expect(actual).toEqual(expected);
  });

  it("Properly handles when neither emails have errors", () => {
    const inviteResponse: IInviteGroupUsersResult = {
      success: true
    };
    const primaryEmailResult: ICreateOrgNotificationResult = {
      success: true
    };
    const secondaryEmailResult: ICreateOrgNotificationResult = {
      success: true
    };
    const combinedEmailResult: ICreateOrgNotificationResult = {
      success: true
    };

    const context = cloneObject(baseContext);
    context.inviteResult = inviteResponse;
    context.secondaryEmailResult = secondaryEmailResult;
    context.primaryEmailResult = primaryEmailResult;

    const actual = _consolidateResults(context);
    const expected: IConsolidatedResult = {
      success: true,
      autoAdd: undefined,
      invite: inviteResponse,
      email: combinedEmailResult
    };
    expect(actual).toEqual(expected);
  });
});
