import {
  IAddGroupUsersResult,
  IInviteGroupUsersResult
} from "@esri/arcgis-rest-portal";
import { IAddMemberContext } from "@esri/hub-common";
import * as inviteModule from "../../../src/utils/_add-users-to-group";
import { _processInvite } from "../../../src/utils/_add-users-to-group";

describe("_process_auto_add", () => {
  it("Delegates properly to inviteUsers and modifies context", async () => {
    const context: IAddMemberContext = {
      groupId: "Capsule Corp",
      allUsers: [],
      usersToAutoAdd: [],
      usersToEmail: [],
      usersToInvite: [],
      requestingUser: null,
      primaryRO: {
        authentication: null,
        isPortal: false,
        hubApiUrl: ""
      }
    };

    const inviteResult: IInviteGroupUsersResult = { success: true };
    const inviteSpy = spyOn(inviteModule, "inviteUsers").and.callFake(() =>
      Promise.resolve(inviteResult)
    );

    const actual = await _processInvite(context);

    expect(inviteSpy).toHaveBeenCalledWith(
      context.groupId,
      context.usersToInvite,
      context.primaryRO.authentication
    );

    expect(actual.inviteResult).toEqual(inviteResult);
  });
});
