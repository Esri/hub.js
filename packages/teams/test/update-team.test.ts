import * as restPortalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "./fixtures";
import { updateTeam } from "../src/update-team";
import { IGroup } from "@esri/arcgis-rest-types";

describe("update-team", function () {
  let updateTeamSpy: jasmine.Spy;
  const getGroup = (props: any) => props as IGroup;

  beforeEach(() => {
    updateTeamSpy = spyOn(restPortalModule, "updateGroup");
  });
  afterEach(() => {
    updateTeamSpy.calls.reset();
  });

  it("Properly delegates to updateGroup in arcgis-rest-portal", async () => {
    updateTeamSpy.and.callFake(() => Promise.resolve());
    const group = getGroup({
      id: "1234",
      capabilities: ["updateitemcontrol"],
    });
    const result = await updateTeam(group, MOCK_AUTH);
    expect(updateTeamSpy).toHaveBeenCalled();
  });
});
