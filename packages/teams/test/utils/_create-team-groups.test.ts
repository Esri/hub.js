import * as _createTeamModule from "../../src/utils/_create-team-group";
import { IGroupTemplate } from "../../src/types";
import { _createTeamGroups } from "../../src/utils/_create-team-groups";
import { IHubRequestOptions, cloneObject } from "@esri/hub-common";
import { IUser } from "@esri/arcgis-rest-auth";

const templates: IGroupTemplate[] = [
  {
    config: {
      groupType: "Hub Collaboration Group",
      type: "core",
      availableIn: ["premium"],
      propertyName: "collaborationGroupId",
      requiredPrivs: ["portal:admin:createUpdateCapableGroup"],
      titleI18n: "collaborationTitle",
      descriptionI18n: "collaborationDesc",
      snippetI18n: "collaborationSnippet"
    },
    access: "org",
    autoJoin: false,
    isInvitationOnly: false,
    isViewOnly: false,
    sortField: "modified",
    sortOrder: "desc",
    capabilities: "updateitemcontrol",
    _edit_privacy: "on",
    _edit_contributors: "on",
    tags: [
      "Hub Group",
      "Hub Initiative Group",
      "Hub Site Group",
      "Hub Core Team Group",
      "Hub Team Group"
    ]
  },
  {
    config: {
      groupType: "Hub Content Group",
      type: "content",
      availableIn: ["premium"],
      propertyName: "contentGroupId",
      requiredPrivs: ["portal:user:createGroup"],
      titleI18n: "contentTitle",
      descriptionI18n: "contentDesc",
      snippetI18n: "contentSnippet"
    },
    access: "public",
    autoJoin: false,
    isInvitationOnly: false,
    isViewOnly: false,
    sortField: "modified",
    sortOrder: "desc",
    tags: [
      "Hub Group",
      "Hub Content Group",
      "Hub Site Group",
      "Hub Initiative Group"
    ]
  },
  {
    config: {
      groupType: "Generic Event Team",
      type: "event",
      availableIn: ["premium"],
      requiredPrivs: ["portal:user:createGroup"],
      titleI18n: "eventTeamTitle",
      descriptionI18n: "eventTeamDesc",
      snippetI18n: "eventTeamSnippet"
    },
    access: "public",
    autoJoin: true,
    isInvitationOnly: false,
    isViewOnly: false,
    sortField: "title",
    sortOrder: "asc",
    tags: ["Hub Group", "Hub Event Group", "Hub Initiative Group"]
  }
];

const translations = {
  addons: {
    services: {
      teams: {
        groups: {
          collaborationTitle: "{title} collaboration title",
          collaborationDesc: "{title} collaboration desc",
          collaborationSnippet: "{title} collaboration snippet",
          contentTitle: "{title} content title",
          contentDesc: "{title} content desc",
          contentSnippet: "{title} content snippet",
          eventTeamTitle: "{title} eventTeam title",
          eventTeamDesc: "{title} eventTeam desc",
          eventTeamSnippet: "{title} eventTeam snippet"
        }
      }
    }
  }
};

describe("_createTeamGroups", () => {
  it("creates team groups", async () => {
    const ro = {
      portalSelf: {}
    } as IHubRequestOptions;

    const createGroupSpy = spyOn(
      _createTeamModule,
      "_createTeamGroup"
    ).and.callFake(
      (user: IUser, grp: IGroupTemplate, opts: IHubRequestOptions) => {
        grp.id = "some-id";
        return Promise.resolve(grp);
      }
    );

    const res = await _createTeamGroups(
      "funny group",
      cloneObject(templates),
      translations,
      ro
    );

    expect(res.groups.length).toEqual(3, "correct number of groups returned");
    expect(res.groups[0].title).toBe(
      "funny group collaboration title",
      "group was translated"
    );
    expect(res.groups[1].title).toBe(
      "funny group content title",
      "group was translated"
    );
    expect(res.groups[2].title).toBe(
      "funny group eventTeam title",
      "group was translated"
    );
    expect(createGroupSpy.calls.count()).toBe(
      3,
      "createTeamGroup called correct number of times"
    );
    expect(createGroupSpy.calls.argsFor(0).length).toBe(
      3,
      "createTeamGroup called with correct number of args"
    );
    expect(res.props).toEqual(
      {
        collaborationGroupId: "some-id",
        contentGroupId: "some-id"
      },
      "returns correct properties hash"
    );
  });

  it("rejects if error", async () => {
    const ro = {
      portalSelf: {}
    } as IHubRequestOptions;

    spyOn(_createTeamModule, "_createTeamGroup").and.returnValue(
      Promise.reject()
    );

    try {
      await _createTeamGroups(
        "funny group",
        cloneObject(templates),
        translations,
        ro
      );
      fail("should have rejected");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
