import { IArcGISContext } from "../../ArcGISContext";
import { IUiSchema, UiSchemaRuleEffects } from "../../core";
import { IHubUser } from "../../core/types/IHubUser";

/**
 * @private
 * constructs the settings uiSchema for Hub Users.
 * This defines how the schema should be rendered in the
 * user workspace settings pane
 * @param i18nScope - translation scope to be interpolated into the uiSchema
 * @param options - additional options to customize the uiSchema
 * @param context - contextual auth and portal information
 * @returns
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: any,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        labelKey: `${i18nScope}.section.userSettings`,
        elements: [
          {
            type: "Control",
            scope:
              "/properties/settings/properties/preview/properties/workspace",
            labelKey: `${i18nScope}.fields.preview.label`,
            options: {
              type: "Control",
              control: "hub-field-input-switch",
              layout: "inline-space-between",
              helperText: {
                labelKey: `${i18nScope}.fields.preview.helperText`,
              },
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: `${i18nScope}.section.orgSettings`,
        rules: [
          {
            effect: UiSchemaRuleEffects.SHOW,
            conditions: [context?.currentUser?.role === "org_admin"],
          },
        ],
        elements: [
          {
            type: "Notice",
            options: {
              notice: {
                id: "org-settings-notice",
                configuration: {
                  noticeType: "notice",
                  closable: false,
                  kind: "info",
                  scale: "m",
                },
                title: `{{${i18nScope}.fields.orgSettings.orgManagementNotice.title:translate}}`,
                message: `{{${i18nScope}.fields.orgSettings.orgManagementNotice.message:translate}}`,
                autoShow: true,
                actions: [
                  {
                    label: `{{${i18nScope}.fields.orgSettings.orgManagementNotice.action:translate}}`,
                    icon: "launch",
                    href: `${context.portalUrl}/home/organization.html?#settings`,
                    target: "_blank",
                  },
                ],
              },
            },
          },
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.orgSettings.sections.siteDefaults`,
            options: {
              section: "block",
            },
            rules: [
              {
                effect: UiSchemaRuleEffects.SHOW,
                conditions: [context?.currentUser?.role === "org_admin"],
              },
            ],
            elements: [
              {
                type: "Control",
                scope:
                  "/properties/hubOrgSettings/properties/showInformationalBanner",
                labelKey: `${i18nScope}.fields.orgSettings.showInformationalBanner.label`,
                options: {
                  type: "Control",
                  control: "hub-field-input-switch",
                  layout: "inline-space-between",
                  helperText: {
                    labelKey: `${i18nScope}.fields.orgSettings.showInformationalBanner.helperText`,
                  },
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.orgSettings.sections.termsAndConditions.label`,
            options: {
              section: "block",
              helperText: {
                labelKey: `${i18nScope}.fields.orgSettings.termsAndConditions.helperText`,
              },
            },
            rules: [
              {
                effect: UiSchemaRuleEffects.SHOW,
                conditions: [
                  context?.currentUser?.role === "org_admin",
                  context.isCommunityOrg,
                ],
              },
            ],
            elements: [
              {
                type: "Section",
                labelKey: `${i18nScope}.sections.orgSettings.sections.termsAndConditions.section.label`,
                scope:
                  "/properties/hubOrgSettings/properties/termsAndConditions",
                options: {
                  section: "subblock",
                  scale: "s",
                  toggleDisplay: "switch",
                },
                elements: [
                  {
                    type: "Control",
                    scope:
                      "/properties/hubOrgSettings/properties/termsAndConditions",
                    labelKey: `${i18nScope}.fields.orgSettings.termsAndConditions.field.label`,
                    options: {
                      control: "hub-field-input-rich-text",
                    },
                  },
                ],
              },
              {
                type: "Section",
                label: "Configure a custom sign up welcome message",
                scope: "/properties/hubOrgSettings/properties/signupText",
                options: {
                  section: "subblock",
                  scale: "s",
                  toggleDisplay: "switch",
                },
                elements: [
                  {
                    type: "Control",
                    scope: "/properties/hubOrgSettings/properties/signupText",
                    options: {
                      control: "hub-field-input-input",
                      type: "textarea",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
};
