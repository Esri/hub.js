import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";
import { IArcGISContext } from "../../../src/ArcGISContext";
import * as UserUiSchemaSettings from "../../../src/users/_internal/UserUiSchemaSettings";
import * as FetchOrgModule from "../../../src/org/fetch-org";

describe("UserUiSchemaSettings:", () => {
  it("creates the uiSchema correctly", async () => {
    const fetchOrgSpy = spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve({});
    });
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
      isOrgAdmin: true,
    } as IArcGISContext);

    expect(fetchOrgSpy).not.toHaveBeenCalled();
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
                      ariaLabel: `{{some.scope.notice.actions.goToOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToOrg:translate}}`,
                      icon: "launch",
                      href: `https://qaext.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToCommunityOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToCommunityOrg:translate}}`,
                      icon: "launch",
                      href: `https://qaext.c.arcgis.com/home/organization.html`,
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
  it("creates the uiSchema correctly when authed as a community org with an e-org attached", async () => {
    const fetchOrgSpy = spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve({
        urlKey: "qaext",
        customBaseUrl: "arcgis.com",
      });
    });
    const chk = await UserUiSchemaSettings.buildUiSchema("some.scope", {}, {
      portalUrl: "https://qaext.c.arcgis.com",
      enterpriseOrgId: "1234",
      trustedOrgs: [
        {
          to: {
            orgId: "1234",
            name: "Staff org",
          },
        },
      ],
      portal: {
        id: "123",
        name: "My org",
      },
      currentUser: {
        role: "org_admin",
        orgId: "123",
      },
      isAlphaOrg: true,
      isOrgAdmin: true,
    } as IArcGISContext);

    expect(fetchOrgSpy).toHaveBeenCalled();
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
                  message: `{{some.scope.notice.staffMessage:translate}}: Staff org`,
                  autoShow: true,
                  actions: [
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToOrg:translate}}`,
                      icon: "launch",
                      href: `https://qaext.c.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToStaffOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToStaffOrg:translate}}`,
                      icon: "launch",
                      href: `https://qaext.arcgis.com/home/organization.html`,
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
    const fetchOrgSpy = spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve({});
    });
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
      isOrgAdmin: true,
    } as IArcGISContext);

    expect(fetchOrgSpy).not.toHaveBeenCalled();
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
                      ariaLabel: `{{some.scope.notice.actions.goToOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToOrg:translate}}`,
                      icon: "launch",
                      href: `https://qaext.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToCommunityOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToCommunityOrg:translate}}`,
                      icon: "launch",
                      href: `https://qaext.c.arcgis.com/home/organization.html`,
                      target: "_blank",
                    },
                  ],
                },
              },
            },
            {
              type: "Control",
              scope:
                "/properties/hubOrgSettings/properties/enableTermsAndConditions",
              labelKey: `some.scope.fields.enableTermsAndConditions.label`,
              options: {
                control: "hub-field-input-switch",
                layout: "inline-space-between",
              },
            },
            {
              type: "Control",
              scope: "/properties/hubOrgSettings/properties/termsAndConditions",
              labelKey: `some.scope.fields.termsAndConditions.label`,
              options: {
                control: "hub-field-input-rich-text",
                type: "textarea",
              },
              rules: [
                {
                  effect: UiSchemaRuleEffects.SHOW,
                  conditions: [
                    {
                      scope:
                        "/properties/hubOrgSettings/properties/enableTermsAndConditions",
                      schema: { const: true },
                    },
                  ],
                },
              ],
            },
            {
              type: "Control",
              scope: "/properties/hubOrgSettings/properties/enableSignUpText",
              labelKey: `some.scope.fields.enableSignUpText.label`,
              options: {
                control: "hub-field-input-switch",
                layout: "inline-space-between",
              },
            },
            {
              type: "Control",
              scope: "/properties/hubOrgSettings/properties/signupText",
              labelKey: `some.scope.fields.signupText.label`,
              options: {
                control: "hub-field-input-rich-text",
                type: "textarea",
              },
              rules: [
                {
                  effect: UiSchemaRuleEffects.SHOW,
                  conditions: [
                    {
                      scope:
                        "/properties/hubOrgSettings/properties/enableSignUpText",
                      schema: { const: true },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });
  it("creates the uiSchema correctly when authed as a community org with an e-org attached", async () => {
    const fetchOrgSpy = spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve({
        urlKey: "qaext",
        customBaseUrl: "arcgis.com",
      });
    });
    const chk = await UserUiSchemaSettings.buildUiSchema("some.scope", {}, {
      portalUrl: "https://qaext.c.arcgis.com",
      enterpriseOrgId: "1234",
      trustedOrgs: [
        {
          to: {
            orgId: "1234",
            name: "Staff org",
          },
        },
      ],
      portal: {
        id: "123",
        name: "My org",
      },
      currentUser: {
        role: "org_admin",
        orgId: "123",
      },
      isAlphaOrg: true,
      isOrgAdmin: true,
    } as IArcGISContext);

    expect(fetchOrgSpy).toHaveBeenCalled();
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
                  message: `{{some.scope.notice.staffMessage:translate}}: Staff org`,
                  autoShow: true,
                  actions: [
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToOrg:translate}}`,
                      icon: "launch",
                      href: `https://qaext.c.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToStaffOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToStaffOrg:translate}}`,
                      icon: "launch",
                      href: `https://qaext.arcgis.com/home/organization.html`,
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
    const fetchOrgSpy = spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve({});
    });
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
      isOrgAdmin: true,
    } as IArcGISContext);

    expect(fetchOrgSpy).not.toHaveBeenCalled();
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
                      ariaLabel: `{{some.scope.notice.actions.goToOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToOrg:translate}}`,
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
  it("creates the uiSchema correctly when authed as a community org with an e-org attached that is private", async () => {
    const fetchOrgSpy = spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve({});
    });
    const chk = await UserUiSchemaSettings.buildUiSchema("some.scope", {}, {
      portalUrl: "https://qaext.c.arcgis.com",
      enterpriseOrgId: "1234",
      trustedOrgs: [
        {
          to: {
            orgId: "1234",
            name: "Staff org",
          },
        },
      ],
      portal: {
        id: "123",
        name: "My org",
      },
      currentUser: {
        role: "org_admin",
        orgId: "123",
      },
      isAlphaOrg: true,
      isOrgAdmin: true,
    } as IArcGISContext);

    expect(fetchOrgSpy).toHaveBeenCalled();
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
                  message: `{{some.scope.notice.staffMessage:translate}}: Staff org`,
                  autoShow: true,
                  actions: [
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToOrg:translate}}`,
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
});
