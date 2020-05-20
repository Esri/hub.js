import { _updateTeamTags } from "../src";
import {
  IInitiativeModel,
  IHubRequestOptions,
  cloneObject
} from "@esri/hub-common";
import * as portalModule from "@esri/arcgis-rest-portal";

describe("_updateTeamTags", () => {
  const initiativeModel = {
    item: {
      id: "init-id"
    }
  } as IInitiativeModel;

  const teams = {
    props: {
      followersGroupId: "foobarfollowers"
    },
    groups: [
      { id: "123", tags: [] },
      { id: "foobarfollowers", tags: ["some tag"] },
      { id: "345", tags: [] }
    ]
  };

  const ro = {
    authentication: {}
  } as IHubRequestOptions;

  let updateSpy: jasmine.Spy;
  beforeEach(() => {
    // TODO MAKE THIS SPY WORK!
    updateSpy = spyOn(portalModule, "updateGroup").and.returnValue(
      Promise.resolve({ success: true })
    );
  });

  xit("adds tag to followers group if present", async () => {
    const res = await _updateTeamTags(
      cloneObject(initiativeModel),
      cloneObject(teams),
      ro
    );

    expect(res.success).toBeTruthy();
    expect(updateSpy).toHaveBeenCalled();
    const updateArgGroup = updateSpy.calls.argsFor(0)[0].group;
    expect(updateArgGroup.tags).toContain("hubInitiativeFollowers|init-id");
  });

  it("does nothing if no followers group", async () => {
    const localTeams = cloneObject(teams);
    delete localTeams.props.followersGroupId;

    const res = await _updateTeamTags(
      cloneObject(initiativeModel),
      localTeams,
      ro
    );

    expect(res.success).toBeTruthy();
    expect(updateSpy).not.toHaveBeenCalled();
  });
});
