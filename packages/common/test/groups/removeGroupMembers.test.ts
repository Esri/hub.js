import * as restPortalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { removeGroupMembers } from "../../src/groups/removeGroupMembers";

describe("remove-users-from-team", function () {
  let removeUsersFromTeamSpy: jasmine.Spy;

  beforeEach(() => {
    removeUsersFromTeamSpy = spyOn(restPortalModule, "removeGroupUsers");
  });
  afterEach(() => {
    removeUsersFromTeamSpy.calls.reset();
  });

  it("Properly delegates to removeGroupUsers in arcgis-rest-portal", async () => {
    removeUsersFromTeamSpy.and.callFake(() => Promise.resolve());
    const result = await removeGroupMembers("1234", ["bob"], MOCK_AUTH);
    expect(removeUsersFromTeamSpy).toHaveBeenCalled();
  });
});
