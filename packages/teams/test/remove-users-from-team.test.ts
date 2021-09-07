import * as restPortalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "./fixtures";
import { removeUsersFromTeam } from "../src/remove-users-from-team";

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
    const result = await removeUsersFromTeam("1234", ["bob"], MOCK_AUTH);
    expect(removeUsersFromTeamSpy).toHaveBeenCalled();
  });
});
