import * as commonModule from "@esri/hub-common";
import { IGroup } from "@esri/arcgis-rest-types";
import * as _createTeamGroupsModule from "../src/utils/_create-team-groups";
import { createHubTeams } from "../src/create-hub-teams";
import { HubTeamType } from "../src/types";
import { cloneObject } from "@esri/hub-common";

describe("createHubTeams", () => {
  const ro = {
    isPortal: false,
    hubApiUrl: "",
    portalSelf: {
      isPortal: false,
      id: "",
      name: "",
      currentVersion: "9.1",
      portalProperties: {
        hub: {
          enabled: true,
        },
      },
      user: {
        privileges: [
          "portal:user:createGroup",
          "portal:user:addExternalMembersToGroup",
        ],
      },
      subscriptionInfo: {
        type: "In House",
      },
    },
    authentication: {} as any,
  } as commonModule.IHubRequestOptions;

  it("creates the correct hub teams", async () => {
    const translations = {};

    const fetchTranslationSpy = spyOn(
      commonModule,
      "fetchHubTranslation"
    ).and.returnValue(Promise.resolve(translations));

    const createTeamGroupsRes = {
      props: {},
      groups: [{ id: "foo" }, { id: "bar" }],
    } as { props: any; groups: IGroup[] };
    const createGroupsSpy = spyOn(
      _createTeamGroupsModule,
      "_createTeamGroups"
    ).and.returnValue(Promise.resolve(createTeamGroupsRes));

    const types: HubTeamType[] = ["content", "event"];

    const createTeamsOpts = {
      title: "foo team",
      types,
      hubRequestOptions: ro,
    };

    const res = await createHubTeams(createTeamsOpts);

    expect(res).toEqual(createTeamGroupsRes);
    expect(fetchTranslationSpy).toHaveBeenCalled();
    expect(createGroupsSpy).toHaveBeenCalled();
    expect(createGroupsSpy.calls.argsFor(0)[1].length).toBe(
      2,
      "created two teams"
    );
  });

  it("works for enterprise w/o subscriptionType", async () => {
    const enterpriseRo = cloneObject(ro);
    delete enterpriseRo.portalSelf.subscriptionInfo;
    const translations = {};

    const fetchTranslationSpy = spyOn(
      commonModule,
      "fetchHubTranslation"
    ).and.returnValue(Promise.resolve(translations));

    const createTeamGroupsRes = {
      props: {},
      groups: [{ id: "foo" }, { id: "bar" }],
    } as { props: any; groups: IGroup[] };
    const createGroupsSpy = spyOn(
      _createTeamGroupsModule,
      "_createTeamGroups"
    ).and.returnValue(Promise.resolve(createTeamGroupsRes));

    const types: HubTeamType[] = ["content", "event"];

    const createTeamsOpts = {
      title: "foo team",
      types,
      hubRequestOptions: ro,
    };

    const res = await createHubTeams(createTeamsOpts);

    expect(res).toEqual(createTeamGroupsRes);
    expect(fetchTranslationSpy).toHaveBeenCalled();
    expect(createGroupsSpy).toHaveBeenCalled();
    expect(createGroupsSpy.calls.argsFor(0)[1].length).toBe(
      2,
      "created two teams"
    );
  });

  it("should reject if it runs into trouble", async () => {
    const createTeamOpts = {
      title: "foo team",
      types: ["team"] as HubTeamType[],
      hubRequestOptions: ro,
    };

    spyOn(commonModule, "fetchHubTranslation").and.returnValue(
      Promise.reject({})
    );

    try {
      await createHubTeams(createTeamOpts);
      fail("should have rejected");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
