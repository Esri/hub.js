import { IAddGroupUsersResult, IUser } from "@esri/arcgis-rest-portal";
import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { cloneObject, IAddMemberContext } from "../../../../src";
import { _formatAutoAddResponse } from "../../../../src/groups/add-users-workflow/output-processors/_format-auto-add-response";
describe("_format-auto-add-esponse", () => {
  const groupId = "fantastic-four";
  const users: IUser[] = [
    { username: "Mr. Fantastic" },
    { username: "Invisible Woman" },
    { username: "Human Torch" },
    { username: "Thing" }
  ];

  const baseContext: IAddMemberContext = {
    groupId,
    allUsers: [],
    usersToAutoAdd: users,
    usersToEmail: [],
    usersToInvite: [],
    requestingUser: null,
    primaryRO: null
  };

  it("Does not modify context if no raw response passed", () => {
    const context = cloneObject(baseContext);
    const result = _formatAutoAddResponse(null, context);
    expect(result).toEqual(baseContext);
  });

  it("Sets success to false if errors are present on raw response", () => {
    const rawResponse: IAddGroupUsersResult = {
      notAdded: [],
      errors: [new ArcGISRequestError()]
    };
    const context = cloneObject(baseContext);
    const result = _formatAutoAddResponse(rawResponse, context);
    expect(result.autoAddResult.success).toEqual(false);
  });

  it("Sets success to false and adds an error if there are non-added users and adds them to invite list", () => {
    const rawResponse: IAddGroupUsersResult = {
      notAdded: users.map(u => u.username)
    };
    const context = cloneObject(baseContext);
    const actual = _formatAutoAddResponse(rawResponse, context);
    expect(actual.autoAddResult.success).toEqual(false);
    expect(actual.autoAddResult.errors.length).toEqual(1);
    expect(actual.usersToInvite).toEqual(users);
  });

  it("Sets success to true if all users were added successfully with no errors", () => {
    const rawResponse: IAddGroupUsersResult = {
      notAdded: []
    };
    const context = cloneObject(baseContext);
    const actual = _formatAutoAddResponse(rawResponse, context);
    expect(actual.autoAddResult.success).toEqual(true);
  });
});
