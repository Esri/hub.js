import { IAddGroupUsersResult } from "@esri/arcgis-rest-portal";
import * as formatResponseModule from "../../../../src/groups/add-users-workflow/output-processors/_format-auto-add-response";
import * as autoAddModule from "../../../../src/groups/autoAddUsers";
import { _processAutoAdd } from "../../../../src/groups/add-users-workflow/output-processors/_process-auto-add";
import { IAddMemberContext } from "../../../../src/groups/add-users-workflow/interfaces";
import { cloneObject } from "../../../../src/util";

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
        hubApiUrl: "",
      },
    };

    const autoAddResult: IAddGroupUsersResult = { notAdded: [] };
    const formattedResult: IAddMemberContext = Object.assign(
      {
        autoAddResult: { success: true },
      },
      cloneObject(context)
    );
    const autoAddSpy = vi
      .spyOn(autoAddModule, "autoAddUsers")
      .mockImplementation(() => Promise.resolve(autoAddResult));
    const formatSpy = vi
      .spyOn(formatResponseModule, "_formatAutoAddResponse")
      .mockImplementation(() => Promise.resolve(formattedResult) as any);

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
