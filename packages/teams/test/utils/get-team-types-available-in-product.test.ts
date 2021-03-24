import * as getTeamsAvailableInProductModule from "../../src/utils/get-teams-available-in-product";
import { getTeamTypesAvailableInProduct } from "../../src/utils/get-team-types-available-in-product";
import { HubTeamType } from "../../src/types";

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

    expect(getTeamTypesAvailableInProduct("premium", "8.4")).toEqual(teamTypes);
  });
});
