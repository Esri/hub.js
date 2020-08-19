import { IUser } from "@esri/arcgis-rest-portal";
import * as _getInviteUsersModule from "../../../../src/groups/add-users-workflow/utils/_get-invite-users";
import { _getEmailUsers } from "../../../../src/groups/add-users-workflow/utils/_get-email-users";

describe("_get_email_users", () => {
  const requestingUser: IUser = {
    username: "Doc Ock",
    orgId: "sinister-six",
    cOrgId: "avengers"
  };
  const users: IUser[] = [
    {
      username: "Vulture",
      orgId: "sinister-six"
    },
    {
      username: "Mysterio",
      orgId: "sinister-six"
    },
    {
      username: "Spider-Man",
      orgId: "avengers"
    }
  ];

  let inviteSpy: jasmine.Spy;
  beforeEach(() => {
    inviteSpy = spyOn(_getInviteUsersModule, "_getInviteUsers");
  });
  afterEach(() => {
    inviteSpy.calls.reset();
  });

  it("Properly calls _getInviteUsers", () => {
    inviteSpy.and.callFake((): IUser[] => []);
    _getEmailUsers(users, requestingUser);
    expect(inviteSpy).toHaveBeenCalledWith(users, requestingUser);
  });

  it("Returns invite users that are part of the same org", () => {
    inviteSpy.and.callFake(() => users);
    const actual = _getEmailUsers(users, requestingUser);
    const expected = [
      {
        username: "Vulture",
        orgId: "sinister-six"
      },
      {
        username: "Mysterio",
        orgId: "sinister-six"
      }
    ];
    expect(actual).toEqual(expected);
  });

  it("Appends calling user if includeSelf is true", () => {
    inviteSpy.and.callFake((): IUser[] => []);
    const actual = _getEmailUsers(users, requestingUser, true);
    const expected = [requestingUser];
    expect(actual).toEqual(expected);
  });
});
