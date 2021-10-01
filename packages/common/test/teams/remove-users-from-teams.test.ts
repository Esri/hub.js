import * as removeUsersFromTeamModule from "../../src/teams/remove-users-from-team";
import { MOCK_AUTH } from "./fixtures";
import { removeUsersFromTeams } from "../../src/teams/remove-users-from-teams";

describe("remove-users-from-team", function () {
  let removeUsersFromTeamsSpy: jasmine.Spy;

  beforeEach(() => {
    removeUsersFromTeamsSpy = spyOn(
      removeUsersFromTeamModule,
      "removeUsersFromTeam"
    );
  });
  afterEach(() => {
    removeUsersFromTeamsSpy.calls.reset();
  });

  it("Properly iterates over the groups passed in", async () => {
    removeUsersFromTeamsSpy.and.callFake(() => Promise.resolve());
    const result = await removeUsersFromTeams(
      ["1234", "4567", "7891"],
      ["bob"],
      MOCK_AUTH
    );
    expect(removeUsersFromTeamsSpy).toHaveBeenCalled();
    expect(removeUsersFromTeamsSpy.calls.count()).toEqual(3);
    expect(removeUsersFromTeamsSpy.calls.argsFor(0)[0]).toEqual("1234");
    expect(removeUsersFromTeamsSpy.calls.argsFor(2)[0]).toEqual("7891");
  });
});
