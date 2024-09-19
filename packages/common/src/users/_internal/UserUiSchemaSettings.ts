import { IArcGISContext } from "../../ArcGISContext";
import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import { _isOrgAdmin } from "../../groups";

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
  let communityOrgName;
  // default Notice action
  const orgNoticeActions = [
    {
      ariaLabel: `{{${i18nScope}.notice.actions.goToEOrg:translate}}`,
      label: `{{${i18nScope}.notice.actions.goToEOrg:translate}}`,
      icon: "launch",
      href: `${context.portalUrl}`,
      target: "_blank",
    },
  ];
  if (context.communityOrgId) {
    // set the community org name
    communityOrgName = context.trustedOrgs.find(
      (org) => org.to.orgId === context.communityOrgId
    ).to.name;
    // add the community org action
    orgNoticeActions.push({
      ariaLabel: `{{${i18nScope}.notice.actions.goToCommunityOrg:translate}}`,
      label: `{{${i18nScope}.notice.actions.goToCommunityOrg:translate}}`,
      icon: "launch",
      href: `${context.communityOrgUrl}`,
      target: "_blank",
    });
  }
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.userSettings`,
        elements: [
          {
            type: "Control",
            scope:
              "/properties/settings/properties/preview/properties/workspace",
            labelKey: `${i18nScope}.fields.workspacePreview.label`,
            options: {
              type: "Control",
              control: "hub-field-input-switch",
              layout: "inline-space-between",
              helperText: {
                labelKey: `${i18nScope}.fields.workspacePreview.helperText`,
              },
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.orgSettings`,
        options: {
          helperText: {
            label: `${context.portal.name}`,
          },
        },
        rules: [
          {
            effect: UiSchemaRuleEffects.SHOW,
            conditions: [
              context.isAlphaOrg &&
                context.currentUser.role === "org_admin" &&
                context.currentUser.orgId === context.portal.id,
            ],
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
                title: `{{${i18nScope}.notice.title:translate}}`,
                message: communityOrgName
                  ? `{{${i18nScope}.notice.communityMessage:translate}}: ${communityOrgName}`
                  : `{{${i18nScope}.notice.message:translate}}`,
                autoShow: true,
                actions: orgNoticeActions,
              },
            },
          },
        ],
      },
    ],
  };
};
