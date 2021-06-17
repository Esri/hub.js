import * as createGroupsModule from "../src/utils/_create-team-groups";
import * as commonModule from "@esri/hub-common";
import { IHubRequestOptions } from "@esri/hub-common";
import { UserSession } from "@esri/arcgis-rest-auth";

import { createHubTeam } from "../src/create-hub-team";
import { HubTeamType, IGroupTemplate } from "../src/types";

describe("createHubTeam", () => {
  const translations = {};
  const ro = {
    isPortal: false,
    hubApiUrl: "",
    portalSelf: {
      isPortal: false,
      id: "",
      name: "",
      currentVersion: "8.4",
      portalProperties: {
        hub: {
          enabled: true
        }
      },
      user: {
        privileges: ["portal:user:createGroup"]
      },
      subscriptionInfo: {
        type: "In House"
      }
    },
    authentication: {} as UserSession
  } as IHubRequestOptions;

  it("creates a hub team", async () => {
    spyOn(createGroupsModule, "_createTeamGroups").and.callFake(
      (
        title: string,
        groups: IGroupTemplate[],
        translationHash: any,
        reqOpts: IHubRequestOptions
      ) => {
        groups.forEach(group => {
          group.id = "some-id";
          delete group.config;
        });

        return Promise.resolve({
          groups,
          props: {
            baz: "boop"
          }
        });
      }
    );

    const fetchTranslationSpy = spyOn(
      commonModule,
      "fetchHubTranslation"
    ).and.returnValue(Promise.resolve(translations));

    const createTeamOpts = {
      title: "foo team",
      type: "content" as const,
      props: { foo: "bar" },
      hubRequestOptions: ro
    };

    const res = await createHubTeam(createTeamOpts);

    expect(res.groups[0].foo).not.toBeDefined(
      'if the team isnt of type "team", props shouldnt be applied'
    );
    expect(fetchTranslationSpy).toHaveBeenCalled();

    fetchTranslationSpy.calls.reset();
    const createTeamOpts2 = {
      title: "foo team",
      type: "team" as const,
      props: { foo: "bar" },
      hubRequestOptions: ro
    };

    const res2 = await createHubTeam(createTeamOpts2);

    expect(res2.groups[0].foo).toBe(
      "bar",
      'if the team is of type "team," props should be applied'
    );
    expect(fetchTranslationSpy).toHaveBeenCalled();
  });

  it("should throw error when passed invalid type", () => {
    const createTeamOpts = {
      title: "foo team",
      type: "foobar" as HubTeamType,
      props: { foo: "bar" },
      hubRequestOptions: ro
    };

    expect(() => createHubTeam(createTeamOpts)).toThrowError();
  });

  it("should reject if it runs into trouble", async () => {
    const createTeamOpts = {
      title: "foo team",
      type: "team" as const,
      props: { foo: "bar" },
      hubRequestOptions: ro
    };

    spyOn(commonModule, "fetchHubTranslation").and.returnValue(
      Promise.reject({})
    );

    try {
      await createHubTeam(createTeamOpts);
      fail("should have rejected");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
