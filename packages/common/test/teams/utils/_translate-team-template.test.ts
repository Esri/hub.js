import { IGroupTemplate } from "../../../src/teams/types";
import { _translateTeamTemplate } from "../../../src/teams/utils/_translate-team-template";

describe("_translateTeamTemplate", () => {
  it("translates the team template", () => {
    const translations = {
      addons: {
        services: {
          teams: {
            groups: {
              collaborationTitle: "{title} title",
              collaborationDesc: "{title} desc",
              collaborationSnippet: "{title} snippet",
            },
          },
        },
      },
    };

    const template: IGroupTemplate = {
      config: {
        groupType: "Portal Collaboration Group",
        type: "core",
        availableIn: ["portal"],
        propertyName: "collaborationGroupId",
        requiredPrivs: [
          "portal:user:createGroup",
          "portal:admin:createUpdateCapableGroup",
        ],
        titleI18n: "collaborationTitle",
        descriptionI18n: "collaborationDesc",
        snippetI18n: "collaborationSnippet",
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
      tags: ["Sites Group", "Sites Core Team Group"],
    };

    const res = _translateTeamTemplate(template, "funny group", translations);

    expect(res.title).toBe("funny group title");
    expect(res.description).toBe("funny group desc");
    expect(res.snippet).toBe("funny group snippet");
  });
});
