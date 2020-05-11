import * as getTeamsAvailableInProductModule from "../../src/teams/get-teams-available-in-product";
import { HubTeamType, getTeamTypesAvailableInProduct } from "../../src";

describe("getTeamTypesAvailableInProduct", () => {
  it("maps group templates to team types", function() {
    const teamTypes: HubTeamType[] = ["core", "event"];

    spyOn(
      getTeamsAvailableInProductModule,
      "getTeamsAvailableInProduct"
    ).and.returnValue(
      teamTypes.map(type => {
        return { config: { type } };
      })
    );

    expect(getTeamTypesAvailableInProduct("premium")).toEqual(teamTypes);
  });
});
