import { IUser } from "@esri/arcgis-rest-portal";
import { cloneObject } from "../../../../src";
import { _getAutoAddUsers } from "../../../../src/groups/add-users-workflow/utils/_get-auto-add-users";

describe("_get_auto_add_users", () => {
  const baseRequestingUser: IUser = {
    username: "Doc Ock",
    orgId: "sinister-six",
    cOrgId: "avengers",
    privileges: []
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
    },
    {
      username: "J. Jonah Jameson",
      orgId: "daily-bugle"
    }
  ];

  it("If user doesn't have portal:admin:assignToGroups, returns empty array", () => {
    const requestingUser = cloneObject(baseRequestingUser);
    const actual = _getAutoAddUsers(users, requestingUser);
    const expected: IUser[] = [];

    expect(actual).toEqual(expected);
  });

  it("If user has portal:admin:assignToGroups, returns members of e-org and c-org", () => {
    const requestingUser = cloneObject(baseRequestingUser);
    requestingUser.privileges = ["portal:admin:assignToGroups"];

    const actual = _getAutoAddUsers(users, requestingUser);
    const expected = [
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

    expect(actual).toEqual(expected);
  });
});
