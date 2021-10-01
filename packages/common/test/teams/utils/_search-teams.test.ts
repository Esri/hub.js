import * as portalModule from "@esri/arcgis-rest-portal";
import { _searchTeams } from "../../../src/teams/utils/_search-teams";

describe("_searchTeams", () => {
  const ro = {
    q: "water",
  } as portalModule.ISearchOptions;

  it("should call with the right search opts", async () => {
    const searchGroupUsersSpy = spyOn(
      portalModule,
      "searchGroups"
    ).and.returnValue(Promise.resolve({}));

    const res = await _searchTeams(ro);

    expect(res).toBeTruthy();

    expect(searchGroupUsersSpy.calls.argsFor(0)[0]).toEqual(
      ro,
      "search group users spy called with correct search opts"
    );
  });
});
