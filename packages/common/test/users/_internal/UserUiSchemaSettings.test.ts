import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";
import { IArcGISContext } from "../../../src/ArcGISContext";
import * as UserUiSchemaSettings from "../../../src/users/_internal/UserUiSchemaSettings";

describe("UserUiSchemaSettings:", () => {
  it("creates the uiSchema correctly", async () => {
    const chk = await UserUiSchemaSettings.buildUiSchema("some.scope", {}, {
      portalUrl: "https://qaext.arcgis.com",
      communityOrgId: "abc",
      trustedOrgs: [
        {
          to: {
            orgId: "abc",
            name: "Community org",
          },
        },
      ],
      communityOrgUrl: "https://qaext.c.arcgis.com",
      portal: {
        id: "123",
        name: "My org",
      },
      currentUser: {
        role: "org_admin",
        orgId: "123",
      },
      isAlphaOrg: true,
    } as IArcGISContext);

    expect(chk).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "some.scope.sections.userSettings",
          elements: [
            {
              type: "Control",
              scope:
                "/properties/settings/properties/preview/properties/workspace",
              labelKey: "some.scope.fields.workspacePreview.label",
              options: {
                type: "Control",
                control: "hub-field-input-switch",
                layout: "inline-space-between",
                helperText: {
                  labelKey: "some.scope.fields.workspacePreview.helperText",
                },
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: `some.scope.sections.orgSettings`,
          options: {
            helperText: {
              label: `My org`,
            },
          },
          rules: [
            {
              effect: UiSchemaRuleEffects.SHOW,
              conditions: [true],
            },
          ],
          elements: [
            {
              type: "Notice",
              options: {
                notice: {
                  configuration: {
                    id: "user-org-settings-notice",
                    noticeType: "notice",
                    closable: false,
                    kind: "info",
                    scale: "m",
                  },
                  title: `{{some.scope.notice.title:translate}}`,
                  message: `{{some.scope.notice.communityMessage:translate}}: Community org`,
                  autoShow: true,
                  actions: [
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToEOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToEOrg:translate}}`,
                      icon: "launch",
                      href: `https://qaext.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToCommunityOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToCommunityOrg:translate}}`,
                      icon: "launch",
                      href: `https://qaext.c.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    });
  });
  it("creates the uiSchema correctly when no community org", async () => {
    const chk = await UserUiSchemaSettings.buildUiSchema("some.scope", {}, {
      portalUrl: "https://qaext.arcgis.com",
      portal: {
        id: "123",
        name: "My org",
      },
      currentUser: {
        role: "org_admin",
        orgId: "123",
      },
      isAlphaOrg: true,
    } as IArcGISContext);

    expect(chk).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "some.scope.sections.userSettings",
          elements: [
            {
              type: "Control",
              scope:
                "/properties/settings/properties/preview/properties/workspace",
              labelKey: "some.scope.fields.workspacePreview.label",
              options: {
                type: "Control",
                control: "hub-field-input-switch",
                layout: "inline-space-between",
                helperText: {
                  labelKey: "some.scope.fields.workspacePreview.helperText",
                },
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: `some.scope.sections.orgSettings`,
          options: {
            helperText: {
              label: `My org`,
            },
          },
          rules: [
            {
              effect: UiSchemaRuleEffects.SHOW,
              conditions: [true],
            },
          ],
          elements: [
            {
              type: "Notice",
              options: {
                notice: {
                  configuration: {
                    id: "user-org-settings-notice",
                    noticeType: "notice",
                    closable: false,
                    kind: "info",
                    scale: "m",
                  },
                  title: `{{some.scope.notice.title:translate}}`,
                  message: `{{some.scope.notice.message:translate}}`,
                  autoShow: true,
                  actions: [
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToEOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToEOrg:translate}}`,
                      icon: "launch",
                      href: `https://qaext.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    });
  });
});
