import * as portalModule from "@esri/arcgis-rest-portal";
import { searchTeamContent } from "../../../src/teams/utils/search-team-content";

describe("searchTeamContent", () => {
  const ro = {
    groupId: "foobarbaz",
    q: "",
  };

  it("should call with the right argument", async () => {
    const searchGroupContentSpy = spyOn(
      portalModule,
      "searchGroupContent"
    ).and.returnValue(Promise.resolve({}));

    const res = await searchTeamContent(ro);

    expect(res).toBeTruthy();

    expect(searchGroupContentSpy.calls.argsFor(0)[0]).toEqual(
      ro,
      "search group content spy called with correct request option"
    );
  });
});
