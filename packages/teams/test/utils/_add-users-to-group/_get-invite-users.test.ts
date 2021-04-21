import { IUser } from "@esri/arcgis-rest-portal";
import * as _getAutoAddUsersModule from "../../../src/utils/_add-users-to-group/_get-auto-add-users";
import { _getInviteUsers } from "../../../src/utils/_add-users-to-group/_get-invite-users";

describe("_get_invite_users", () => {
  const requestingUser: IUser = {
    username: "Doc Ock",
    orgId: "sinister-six",
    cOrgId: "avengers"
  };
  const users: IUser[] = [
    {
      username: "Mysterio",
      orgId: "sinister-six"
    },
    {
      username: "Venom",
      orgId: "symbiotes"
    },
    {
      username: "Spider-Man",
      orgId: "avengers"
    }
  ];

  let addSpy: jasmine.Spy;
  beforeEach(() => {
    addSpy = spyOn(_getAutoAddUsersModule, "_getAutoAddUsers");
  });
  afterEach(() => {
    addSpy.calls.reset();
  });

  it("Properly calls _getAutoAddUsers", () => {
    addSpy.and.callFake((): IUser[] => []);
    _getInviteUsers(users, requestingUser);
    expect(addSpy).toHaveBeenCalledWith(users, requestingUser);
  });

  it("Returns users that will not be autoAdded", () => {
    addSpy.and.callFake(() => [
      {
        username: "Mysterio",
        orgId: "sinister-six"
      }
    ]);

    const actual = _getInviteUsers(users, requestingUser);
    const expected = [
      {
        username: "Venom",
        orgId: "symbiotes"
      },
      {
        username: "Spider-Man",
        orgId: "avengers"
      }
    ];

    expect(actual).toEqual(expected);
  });
});
