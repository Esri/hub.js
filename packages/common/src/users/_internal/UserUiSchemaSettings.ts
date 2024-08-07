import { IArcGISContext } from "../../ArcGISContext";
import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import { IHubUser } from "../../core/types";

/**
 * @private
 * constructs the settings uiSchema for Hub Users.
 * This defines how the schema should be rendered
 * in the user workspace settings pane
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
        label: "User settings",
        elements: [
          {
            type: "Control",
            scope:
              "/properties/settings/properties/preview/properties/workspace",
            label: "Enable workspace preview",
            options: {
              type: "Control",
              control: "hub-field-input-switch",
              layout: "inline-space-between",
              helperText: {
                label:
                  "Workspaces are available for preview but still in development as we expand functionality. You can disable workspaces at any time during the preview period. Enabling workspaces will only impact this user account.",
              },
            },
          },
        ],
      },
      context.currentUser.role === "org_admin" && {
        type: "Section",
        label: "Organization settings",
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
                title: "Organization management",
                message:
                  "Most staff and community (Hub Premium only) organization settings are now managed in the ArcGIS home application.",
                autoShow: true,
                actions: [
                  {
                    label: "Go to organization settings",
                    icon: "launch",
                    href: `${context.portalUrl}/home/organization.html?#settings`,
                    target: "_blank",
                  },
                ],
              },
            },
          },
          context.currentUser.role === "org_admin" && {
            type: "Section",
            label: "Site display defaults",
            options: {
              section: "block",
            },
            elements: [
              {
                type: "Control",
                scope:
                  "/properties/hubOrgSettings/properties/showInformationalBanner",
                label: "Information banner",
                options: {
                  type: "Control",
                  control: "hub-field-input-switch",
                  layout: "inline-space-between",
                  helperText: {
                    label:
                      "Display your employee organization’s information banner, if configured, across all sites and pages. This is a global setting and cannot be turned on/off for a particular site.",
                  },
                },
              },
            ],
          },
          context.isCommunityOrg &&
            context.currentUser.role === "org_admin" && {
              type: "Section",
              label: "Sign in options",
              options: {
                section: "block",
                helperText: {
                  label:
                    "Customize the information users will see if they choose to sign up for a Community account in your Hub.",
                },
              },
              elements: [
                {
                  type: "Section",
                  label: "Require custom terms of use on sign up form",
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
                      label: "Terms of use",
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
