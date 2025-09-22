import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";
import { IArcGISContext } from "../../../src/types/IArcGISContext";
import * as UserUiSchemaSettings from "../../../src/users/_internal/UserUiSchemaSettings";
import * as FetchOrgModule from "../../../src/org/fetch-org";
import * as PortalModule from "@esri/arcgis-rest-portal";

describe("UserUiSchemaSettings:", () => {
  let portalSettingsSpy: jasmine.Spy;

  afterEach(() => {
    portalSettingsSpy.calls.reset();
  });

  it("reports misconfiguration for Community Org", async () => {
    spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve({});
    });
    const consoleWarnSpy = spyOn(console, "warn").and.callThrough();

    portalSettingsSpy = spyOn(PortalModule, "getPortalSettings").and.callFake(
      () => {
        return Promise.resolve({
          informationalBanner: {
            enabled: true,
          },
        });
      }
    );

    const chk = await UserUiSchemaSettings.buildUiSchema("some.scope", {}, {
      portalUrl: "https://qaext.arcgis.com",
      communityOrgId: "xyz",
      trustedOrgs: [
        {
          to: {
            orgId: "abc",
            name: "Other org",
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

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `Links to the Community Org could not be displayed. There appears to be a misconfiguration in the trusted org relationships for this organization. Please contact Esri Customer Service for assistance.`
    );
    expect(chk).toBeDefined();
  });

  it("reports misconfiguration for Staff Org", async () => {
    spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve({});
    });
    const consoleWarnSpy = spyOn(console, "warn").and.callThrough();

    portalSettingsSpy = spyOn(PortalModule, "getPortalSettings").and.callFake(
      () => {
        return Promise.resolve({
          informationalBanner: {
            enabled: true,
          },
        });
      }
    );

    const chk = await UserUiSchemaSettings.buildUiSchema("some.scope", {}, {
      portalUrl: "https://qaext.arcgis.com",
      enterpriseOrgId: "xyz",
      trustedOrgs: [
        {
          to: {
            orgId: "abc",
            name: "Other org",
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

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `Links to the Staff Org could not be displayed. There appears to be a misconfiguration in the trusted org relationships for this organization. Please contact Esri Customer Service for assistance.`
    );
    expect(chk).toBeDefined();
  });

  it("creates the uiSchema correctly", async () => {
    const fetchOrgSpy = spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve({});
    });

    portalSettingsSpy = spyOn(PortalModule, "getPortalSettings").and.callFake(
      () => {
        return Promise.resolve({
          informationalBanner: {
            enabled: true,
          },
        });
      }
    );

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
                "/properties/settings/properties/features/properties/workspace",
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
          labelKey: `some.scope.sections.orgSettings.label`,
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
                      href: `https://qaext.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToCommunityOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToCommunityOrg:translate}}`,
                      href: `https://qaext.c.arcgis.com/home/index.html`,
                      target: "_blank",
                    },
                  ],
                },
              },
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.siteDefaults.label",
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  labelKey: "some.scope.fields.infoBanner.label",
                  options: {
                    type: "Control",
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        "{{some.scope.fields.infoBanner.helperText:translate}}",
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.DISABLE,
                      conditions: [false],
                    },
                  ],
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  options: {
                    control: "calcite-link",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        '<calcite-link href=https://qaext.arcgis.com/home/organization.html?tab=security#settings target="_blank" icon-end="launch">{{some.scope.fields.infoBanner.goToBannerConfig:translate}}</calcite-link>',
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.SHOW,
                      conditions: [true],
                    },
                  ],
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.signinSettings.label",
              rules: [
                {
                  effect: UiSchemaRuleEffects.SHOW,
                  conditions: [false],
                },
              ],
              options: {
                helperText: {
                  labelKey: `some.scope.sections.orgSettings.signinSettings.helperText`,
                },
              },
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/enableTermsAndConditions",
                  labelKey: "some.scope.fields.enableTermsAndConditions.label",
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/termsAndConditions",
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
                  scope:
                    "/properties/hubOrgSettings/properties/enableSignupText",
                  labelKey: `some.scope.fields.enableSignupText.label`,
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope: "/properties/hubOrgSettings/properties/signupText",
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
                            "/properties/hubOrgSettings/properties/enableSignupText",
                          schema: { const: true },
                        },
                      ],
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
    portalSettingsSpy = spyOn(PortalModule, "getPortalSettings").and.callFake(
      () => {
        return Promise.resolve({
          informationalBanner: {
            enabled: true,
          },
        });
      }
    );
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
                "/properties/settings/properties/features/properties/workspace",
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
          labelKey: `some.scope.sections.orgSettings.label`,
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
                      href: `https://qaext.c.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToStaffOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToStaffOrg:translate}}`,
                      href: `https://qaext.arcgis.com/home/index.html`,
                      target: "_blank",
                    },
                  ],
                },
              },
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.siteDefaults.label",
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  labelKey: "some.scope.fields.infoBanner.label",
                  options: {
                    type: "Control",
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        "{{some.scope.fields.infoBanner.helperText:translate}}",
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.DISABLE,
                      conditions: [false],
                    },
                  ],
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  options: {
                    control: "calcite-link",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        '<calcite-link href=https://qaext.c.arcgis.com/home/organization.html?tab=security#settings target="_blank" icon-end="launch">{{some.scope.fields.infoBanner.goToBannerConfig:translate}}</calcite-link>',
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.SHOW,
                      conditions: [true],
                    },
                  ],
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.signinSettings.label",
              rules: [
                {
                  effect: UiSchemaRuleEffects.SHOW,
                  conditions: [false],
                },
              ],
              options: {
                helperText: {
                  labelKey: `some.scope.sections.orgSettings.signinSettings.helperText`,
                },
              },
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/enableTermsAndConditions",
                  labelKey: "some.scope.fields.enableTermsAndConditions.label",
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/termsAndConditions",
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
                  scope:
                    "/properties/hubOrgSettings/properties/enableSignupText",
                  labelKey: `some.scope.fields.enableSignupText.label`,
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope: "/properties/hubOrgSettings/properties/signupText",
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
                            "/properties/hubOrgSettings/properties/enableSignupText",
                          schema: { const: true },
                        },
                      ],
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
  it("creates the uiSchema correctly when authed as a community org with an e-org attached but not an org admin", async () => {
    const fetchOrgSpy = spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve({
        urlKey: "qaext",
        customBaseUrl: "arcgis.com",
      });
    });
    portalSettingsSpy = spyOn(PortalModule, "getPortalSettings").and.callFake(
      () => {
        return Promise.resolve({
          informationalBanner: {
            enabled: true,
          },
        });
      }
    );
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
        role: "org_user",
        orgId: "123",
      },
      isAlphaOrg: true,
      isOrgAdmin: false,
      isCommunityOrg: true,
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
                "/properties/settings/properties/features/properties/workspace",
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
          labelKey: `some.scope.sections.orgSettings.label`,
          options: {
            helperText: {
              label: `My org`,
            },
          },
          rules: [
            {
              effect: UiSchemaRuleEffects.SHOW,
              conditions: [false],
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
                      href: `https://qaext.c.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToStaffOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToStaffOrg:translate}}`,
                      href: `https://qaext.arcgis.com/home/index.html`,
                      target: "_blank",
                    },
                  ],
                },
              },
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.siteDefaults.label",
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  labelKey: "some.scope.fields.infoBanner.label",
                  options: {
                    type: "Control",
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        "{{some.scope.fields.infoBanner.helperText:translate}}",
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.DISABLE,
                      conditions: [false],
                    },
                  ],
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  options: {
                    control: "calcite-link",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        '<calcite-link href=https://qaext.c.arcgis.com/home/organization.html?tab=security#settings target="_blank" icon-end="launch">{{some.scope.fields.infoBanner.goToBannerConfig:translate}}</calcite-link>',
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.SHOW,
                      conditions: [false],
                    },
                  ],
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.signinSettings.label",
              rules: [
                {
                  effect: UiSchemaRuleEffects.SHOW,
                  conditions: [false],
                },
              ],
              options: {
                helperText: {
                  labelKey: `some.scope.sections.orgSettings.signinSettings.helperText`,
                },
              },
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/enableTermsAndConditions",
                  labelKey: "some.scope.fields.enableTermsAndConditions.label",
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/termsAndConditions",
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
                  scope:
                    "/properties/hubOrgSettings/properties/enableSignupText",
                  labelKey: `some.scope.fields.enableSignupText.label`,
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope: "/properties/hubOrgSettings/properties/signupText",
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
                            "/properties/hubOrgSettings/properties/enableSignupText",
                          schema: { const: true },
                        },
                      ],
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
  it("creates the uiSchema correctly when no community org", async () => {
    const fetchOrgSpy = spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve({});
    });
    portalSettingsSpy = spyOn(PortalModule, "getPortalSettings").and.callFake(
      () => {
        return Promise.resolve({
          informationalBanner: {
            enabled: true,
          },
        });
      }
    );
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
      trustedOrgs: [],
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
                "/properties/settings/properties/features/properties/workspace",
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
          labelKey: `some.scope.sections.orgSettings.label`,
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
                      href: `https://qaext.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                  ],
                },
              },
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.siteDefaults.label",
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  labelKey: "some.scope.fields.infoBanner.label",
                  options: {
                    type: "Control",
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        "{{some.scope.fields.infoBanner.helperText:translate}}",
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.DISABLE,
                      conditions: [false],
                    },
                  ],
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  options: {
                    control: "calcite-link",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        '<calcite-link href=https://qaext.arcgis.com/home/organization.html?tab=security#settings target="_blank" icon-end="launch">{{some.scope.fields.infoBanner.goToBannerConfig:translate}}</calcite-link>',
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.SHOW,
                      conditions: [true],
                    },
                  ],
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.signinSettings.label",
              rules: [
                {
                  effect: UiSchemaRuleEffects.SHOW,
                  conditions: [false],
                },
              ],
              options: {
                helperText: {
                  labelKey: `some.scope.sections.orgSettings.signinSettings.helperText`,
                },
              },
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/enableTermsAndConditions",
                  labelKey: "some.scope.fields.enableTermsAndConditions.label",
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/termsAndConditions",
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
                  scope:
                    "/properties/hubOrgSettings/properties/enableSignupText",
                  labelKey: `some.scope.fields.enableSignupText.label`,
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope: "/properties/hubOrgSettings/properties/signupText",
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
                            "/properties/hubOrgSettings/properties/enableSignupText",
                          schema: { const: true },
                        },
                      ],
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
    portalSettingsSpy = spyOn(PortalModule, "getPortalSettings").and.callFake(
      () => {
        return Promise.resolve({
          informationalBanner: {
            enabled: true,
          },
        });
      }
    );
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
      isCommunityOrg: true,
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
                "/properties/settings/properties/features/properties/workspace",
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
          labelKey: `some.scope.sections.orgSettings.label`,
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
                      href: `https://qaext.c.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToStaffOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToStaffOrg:translate}}`,
                      href: `https://qaext.arcgis.com/home/index.html`,
                      target: "_blank",
                    },
                  ],
                },
              },
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.siteDefaults.label",
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  labelKey: "some.scope.fields.infoBanner.label",
                  options: {
                    type: "Control",
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        "{{some.scope.fields.infoBanner.helperText:translate}}",
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.DISABLE,
                      conditions: [false],
                    },
                  ],
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  options: {
                    control: "calcite-link",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        '<calcite-link href=https://qaext.c.arcgis.com/home/organization.html?tab=security#settings target="_blank" icon-end="launch">{{some.scope.fields.infoBanner.goToBannerConfig:translate}}</calcite-link>',
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.SHOW,
                      conditions: [true],
                    },
                  ],
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.signinSettings.label",
              rules: [
                {
                  effect: UiSchemaRuleEffects.SHOW,
                  conditions: [true],
                },
              ],
              options: {
                helperText: {
                  labelKey: `some.scope.sections.orgSettings.signinSettings.helperText`,
                },
              },
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/enableTermsAndConditions",
                  labelKey: "some.scope.fields.enableTermsAndConditions.label",
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/termsAndConditions",
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
                  scope:
                    "/properties/hubOrgSettings/properties/enableSignupText",
                  labelKey: `some.scope.fields.enableSignupText.label`,
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope: "/properties/hubOrgSettings/properties/signupText",
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
                            "/properties/hubOrgSettings/properties/enableSignupText",
                          schema: { const: true },
                        },
                      ],
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
  xit("creates the uiSchema correctly when no community org", async () => {
    const fetchOrgSpy = spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve({});
    });
    portalSettingsSpy = spyOn(PortalModule, "getPortalSettings").and.callFake(
      () => {
        return Promise.resolve({
          informationalBanner: {
            enabled: true,
          },
        });
      }
    );
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
      trustedOrgs: [],
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
                "/properties/settings/properties/features/properties/workspace",
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
          labelKey: `some.scope.sections.orgSettings.label`,
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
                      href: `https://qaext.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                  ],
                },
              },
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.siteDefaults.label",
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  labelKey: "some.scope.fields.infoBanner.label",
                  options: {
                    type: "Control",
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        "{{some.scope.fields.infoBanner.helperText:translate}}",
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.DISABLE,
                      conditions: [false],
                    },
                  ],
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  options: {
                    control: "calcite-link",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        '<calcite-link href=https://qaext.arcgis.com/home/organization.html?tab=security#settings target="_blank" icon-end="launch">{{some.scope.fields.infoBanner.goToBannerConfig:translate}}</calcite-link>',
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.SHOW,
                      conditions: [true],
                    },
                  ],
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.signinSettings.label",
              rules: [
                {
                  effect: UiSchemaRuleEffects.SHOW,
                  conditions: [false],
                },
              ],
              options: {
                helperText: {
                  labelKey: `some.scope.sections.orgSettings.signinSettings.helperText`,
                },
              },
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/enableTermsAndConditions",
                  labelKey: "some.scope.fields.enableTermsAndConditions.label",
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/termsAndConditions",
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
                  scope:
                    "/properties/hubOrgSettings/properties/enableSignupText",
                  labelKey: `some.scope.fields.enableSignupText.label`,
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope: "/properties/hubOrgSettings/properties/signupText",
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
                            "/properties/hubOrgSettings/properties/enableSignupText",
                          schema: { const: true },
                        },
                      ],
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
  it("creates the uiSchema correctly when authed as a community org with an e-org attached that is private", async () => {
    const fetchOrgSpy = spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve({});
    });
    portalSettingsSpy = spyOn(PortalModule, "getPortalSettings").and.callFake(
      () => {
        return Promise.resolve({
          informationalBanner: {
            enabled: true,
          },
        });
      }
    );
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
                "/properties/settings/properties/features/properties/workspace",
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
          labelKey: `some.scope.sections.orgSettings.label`,
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
                      href: `https://qaext.c.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                  ],
                },
              },
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.siteDefaults.label",
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  labelKey: "some.scope.fields.infoBanner.label",
                  options: {
                    type: "Control",
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        "{{some.scope.fields.infoBanner.helperText:translate}}",
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.DISABLE,
                      conditions: [false],
                    },
                  ],
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  options: {
                    control: "calcite-link",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        '<calcite-link href=https://qaext.c.arcgis.com/home/organization.html?tab=security#settings target="_blank" icon-end="launch">{{some.scope.fields.infoBanner.goToBannerConfig:translate}}</calcite-link>',
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.SHOW,
                      conditions: [true],
                    },
                  ],
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.signinSettings.label",
              rules: [
                {
                  effect: UiSchemaRuleEffects.SHOW,
                  conditions: [false],
                },
              ],
              options: {
                helperText: {
                  labelKey: `some.scope.sections.orgSettings.signinSettings.helperText`,
                },
              },
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/enableTermsAndConditions",
                  labelKey: "some.scope.fields.enableTermsAndConditions.label",
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/termsAndConditions",
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
                  scope:
                    "/properties/hubOrgSettings/properties/enableSignupText",
                  labelKey: `some.scope.fields.enableSignupText.label`,
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope: "/properties/hubOrgSettings/properties/signupText",
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
                            "/properties/hubOrgSettings/properties/enableSignupText",
                          schema: { const: true },
                        },
                      ],
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

  it("creates the uiSchema correctly when portalSettings.informationalBanner not enabled", async () => {
    const fetchOrgSpy = spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve({});
    });
    portalSettingsSpy = spyOn(PortalModule, "getPortalSettings").and.callFake(
      () => {
        return Promise.resolve({
          informationalBanner: {
            enabled: false,
          },
        });
      }
    );
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
                "/properties/settings/properties/features/properties/workspace",
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
          labelKey: `some.scope.sections.orgSettings.label`,
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
                      href: `https://qaext.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToCommunityOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToCommunityOrg:translate}}`,
                      href: `https://qaext.c.arcgis.com/home/index.html`,
                      target: "_blank",
                    },
                  ],
                },
              },
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.siteDefaults.label",
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  labelKey: "some.scope.fields.infoBanner.label",
                  options: {
                    type: "Control",
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        "{{some.scope.fields.infoBanner.helperTextWhenDisabled:translate}}",
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.DISABLE,
                      conditions: [true],
                    },
                  ],
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  options: {
                    control: "calcite-link",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        '<calcite-link href=https://qaext.arcgis.com/home/organization.html?tab=security#settings target="_blank" icon-end="launch">{{some.scope.fields.infoBanner.goToBannerConfig:translate}}</calcite-link>',
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.SHOW,
                      conditions: [true],
                    },
                  ],
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.signinSettings.label",
              rules: [
                {
                  effect: UiSchemaRuleEffects.SHOW,
                  conditions: [false],
                },
              ],
              options: {
                helperText: {
                  labelKey: `some.scope.sections.orgSettings.signinSettings.helperText`,
                },
              },
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/enableTermsAndConditions",
                  labelKey: "some.scope.fields.enableTermsAndConditions.label",
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/termsAndConditions",
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
                  scope:
                    "/properties/hubOrgSettings/properties/enableSignupText",
                  labelKey: `some.scope.fields.enableSignupText.label`,
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope: "/properties/hubOrgSettings/properties/signupText",
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
                            "/properties/hubOrgSettings/properties/enableSignupText",
                          schema: { const: true },
                        },
                      ],
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
  it("creates the uiSchema correctly when unable to access portalSettings.informationalBanner", async () => {
    const fetchOrgSpy = spyOn(FetchOrgModule, "fetchOrg").and.callFake(() => {
      return Promise.resolve({});
    });
    portalSettingsSpy = spyOn(PortalModule, "getPortalSettings").and.callFake(
      () => {
        return Promise.resolve(new Error("Unable to access portal settings"));
      }
    );
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
                "/properties/settings/properties/features/properties/workspace",
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
          labelKey: `some.scope.sections.orgSettings.label`,
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
                      href: `https://qaext.arcgis.com/home/organization.html?tab=general#settings`,
                      target: "_blank",
                    },
                    {
                      ariaLabel: `{{some.scope.notice.actions.goToCommunityOrg:translate}}`,
                      label: `{{some.scope.notice.actions.goToCommunityOrg:translate}}`,
                      href: `https://qaext.c.arcgis.com/home/index.html`,
                      target: "_blank",
                    },
                  ],
                },
              },
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.siteDefaults.label",
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  labelKey: "some.scope.fields.infoBanner.label",
                  options: {
                    type: "Control",
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        "{{some.scope.fields.infoBanner.helperTextWhenDisabled:translate}}",
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.DISABLE,
                      conditions: [true],
                    },
                  ],
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/showInformationalBanner",
                  options: {
                    control: "calcite-link",
                    layout: "inline-space-between",
                    helperText: {
                      label:
                        '<calcite-link href=https://qaext.arcgis.com/home/organization.html?tab=security#settings target="_blank" icon-end="launch">{{some.scope.fields.infoBanner.goToBannerConfig:translate}}</calcite-link>',
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.SHOW,
                      conditions: [true],
                    },
                  ],
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.orgSettings.signinSettings.label",
              rules: [
                {
                  effect: UiSchemaRuleEffects.SHOW,
                  conditions: [false],
                },
              ],
              options: {
                helperText: {
                  labelKey: `some.scope.sections.orgSettings.signinSettings.helperText`,
                },
              },
              elements: [
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/enableTermsAndConditions",
                  labelKey: "some.scope.fields.enableTermsAndConditions.label",
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope:
                    "/properties/hubOrgSettings/properties/termsAndConditions",
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
                  scope:
                    "/properties/hubOrgSettings/properties/enableSignupText",
                  labelKey: `some.scope.fields.enableSignupText.label`,
                  options: {
                    control: "hub-field-input-switch",
                    layout: "inline-space-between",
                  },
                },
                {
                  type: "Control",
                  scope: "/properties/hubOrgSettings/properties/signupText",
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
                            "/properties/hubOrgSettings/properties/enableSignupText",
                          schema: { const: true },
                        },
                      ],
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
});
