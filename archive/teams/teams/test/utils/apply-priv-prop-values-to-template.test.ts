import { IGroupTemplate } from "../../src/types";
import { applyPrivPropValuesToTemplate } from "../../src/utils/apply-priv-prop-values-to-template";

describe("applyPrivPropValuesToTemplate", () => {
  it("Correctly updates template", () => {
    const template = {
      membershipAccess: "org",
      config: {
        groupType: "Hub Collaboration Group",
        type: "core",
        availableIn: ["premium"],
        propertyName: "collaborationGroupId",
        requiredPrivs: ["portal:admin:createUpdateCapableGroup"],
        titleI18n: "collaborationTitle",
        descriptionI18n: "collaborationDesc",
        snippetI18n: "collaborationSnippet",
        privPropValues: [
          {
            priv: "portal:user:addExternalMembersToGroup",
            prop: "membershipAccess",
            value: "collaboration",
          },
        ],
      },
    } as IGroupTemplate;
    const user = {
      privileges: ["portal:user:addExternalMembersToGroup"],
    };
    const result = applyPrivPropValuesToTemplate(user, template);
    expect(result.membershipAccess).toBe(
      "collaboration",
      "membershipAccess is properly updated"
    );
  });
  it("Correctly does not update template when privPropValues is not present", () => {
    const template = {
      membershipAccess: "org",
      config: {
        groupType: "Hub Collaboration Group",
        type: "core",
        availableIn: ["premium"],
        propertyName: "collaborationGroupId",
        requiredPrivs: ["portal:admin:createUpdateCapableGroup"],
        titleI18n: "collaborationTitle",
        descriptionI18n: "collaborationDesc",
        snippetI18n: "collaborationSnippet",
      },
    } as IGroupTemplate;
    const user = {
      privileges: ["portal:user:addExternalMembersToGroup"],
    };
    const result = applyPrivPropValuesToTemplate(user, template);
    expect(result.membershipAccess).toBe(
      "org",
      "membershipAccess is properly updated"
    );
  });
  it("Correctly does not update template when privPropValues is an empty array", () => {
    const template = {
      membershipAccess: "org",
      config: {
        groupType: "Hub Collaboration Group",
        type: "core",
        availableIn: ["premium"],
        propertyName: "collaborationGroupId",
        requiredPrivs: ["portal:admin:createUpdateCapableGroup"],
        titleI18n: "collaborationTitle",
        descriptionI18n: "collaborationDesc",
        snippetI18n: "collaborationSnippet",
        privPropValues: [],
      },
    } as IGroupTemplate;
    const user = {
      privileges: ["portal:user:addExternalMembersToGroup"],
    };
    const result = applyPrivPropValuesToTemplate(user, template);
    expect(result.membershipAccess).toBe(
      "org",
      "membershipAccess is properly updated"
    );
  });
  it("Correctly does not update template if user does not have priv in privPropValues", () => {
    const template = {
      membershipAccess: "org",
      config: {
        groupType: "Hub Collaboration Group",
        type: "core",
        availableIn: ["premium"],
        propertyName: "collaborationGroupId",
        requiredPrivs: ["portal:admin:createUpdateCapableGroup"],
        titleI18n: "collaborationTitle",
        descriptionI18n: "collaborationDesc",
        snippetI18n: "collaborationSnippet",
        privPropValues: [],
      },
    } as IGroupTemplate;
    const user = {
      privileges: ["portal:user:createGroup"],
    };
    const result = applyPrivPropValuesToTemplate(user, template);
    expect(result.membershipAccess).toBe(
      "org",
      "membershipAccess is properly updated"
    );
  });
});
