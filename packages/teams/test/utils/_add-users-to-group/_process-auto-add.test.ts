import { IAddGroupUsersResult } from "@esri/arcgis-rest-portal";
import { cloneObject } from "@esri/hub-common";
import * as formatResponseModule from "../../../src/utils/_add-users-to-group/_format-auto-add-response";
import * as autoAddModule from "../../../src/utils/_add-users-to-group/auto-add-users";
import { _processAutoAdd } from "../../../src/utils/_add-users-to-group/_process-auto-add";
import { IAddMemberContext } from "../../../src/utils/_add-users-to-group/interfaces";

describe("_process_auto_add", () => {
  it("Delegates properly to autoAddUsers and _formatAutoAddResponse", async () => {
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

    const autoAddResult: IAddGroupUsersResult = { notAdded: [] };
    const formattedResult: IAddMemberContext = Object.assign(
      {
        autoAddResult: { success: true }
      },
      cloneObject(context)
    );
    const autoAddSpy = spyOn(autoAddModule, "autoAddUsers").and.callFake(() =>
      Promise.resolve(autoAddResult)
    );
    const formatSpy = spyOn(
      formatResponseModule,
      "_formatAutoAddResponse"
    ).and.callFake(() => Promise.resolve(formattedResult));

    const actual = await _processAutoAdd(context);

    expect(autoAddSpy).toHaveBeenCalledWith(
      context.groupId,
      context.usersToAutoAdd,
      context.primaryRO.authentication
    );
    expect(formatSpy).toHaveBeenCalledWith(autoAddResult, context);
    expect(actual).toEqual(formattedResult);
  });
});
