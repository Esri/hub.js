import { IArcGISContext } from "../../ArcGISContext";
import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import { fetchOrg } from "../../org/fetch-org";
import { failSafe } from "../../utils/fail-safe";

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
  let associatedOrgName;
  let noticeMessage = `{{${i18nScope}.notice.message:translate}}`;
  // default notice action - "Go to organization settings"
  const orgNoticeActions = [
    {
      ariaLabel: `{{${i18nScope}.notice.actions.goToOrg:translate}}`,
      label: `{{${i18nScope}.notice.actions.goToOrg:translate}}`,
      icon: "launch",
      href: `${context.portalUrl}/home/organization.html?tab=general#settings`,
      target: "_blank",
    },
  ];
  /**
   * If there is a community org relationship, or we are in a community
   * org with an enterprise org relationship, show another action that
   * links out to the corresponding relationship org ("Go to community
   * organization" or "Go to staff organization")
   */
  if (context.communityOrgId || context.enterpriseOrgId) {
    const actionLabelKey = context.enterpriseOrgId
      ? "goToStaffOrg"
      : "goToCommunityOrg";
    // get the org url we will include in the notice action
    const orgUrl = await _getCommunityOrEnterpriseAGOUrl(context);
    // We want to always show the associated org name in the notice, if there is one
    // So we get either the community or enterprise org id
    const orgId = context.enterpriseOrgId || context.communityOrgId;
    // then we get the associated org name from trusted orgs.
    associatedOrgName = context.trustedOrgs.find(
      (org) => org.to.orgId === orgId
    ).to.name;
    // update the notice message with the associated org name
    noticeMessage = context.enterpriseOrgId
      ? `{{${i18nScope}.notice.staffMessage:translate}}: ${associatedOrgName}`
      : `{{${i18nScope}.notice.communityMessage:translate}}: ${associatedOrgName}`;
    // add the community org action if there is an org url
    if (orgUrl) {
      orgNoticeActions.push({
        ariaLabel: `{{${i18nScope}.notice.actions.${actionLabelKey}:translate}}`,
        label: `{{${i18nScope}.notice.actions.${actionLabelKey}:translate}}`,
        icon: "launch",
        href: orgUrl,
        target: "_blank",
      });
    }
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
              context.isOrgAdmin &&
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
                message: noticeMessage,
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

async function _getCommunityOrEnterpriseAGOUrl(
  context: IArcGISContext
): Promise<string> {
  let orgUrl = `${context.communityOrgUrl}/home/organization.html`;
  // if there's an enterprise org, we need to fetch it to get the url
  if (context.enterpriseOrgId) {
    // Fail safe fetch the e-org
    const fsGetOrg = failSafe(fetchOrg, {});
    const org = await fsGetOrg(context.enterpriseOrgId, context.requestOptions);
    // If the org response has a urlKey it is a real response. If the urlKey is missing the org is private
    if (org.urlKey) {
      // construct the url
      orgUrl = `https://${org.urlKey}.${org.customBaseUrl}/home/organization.html`;
    } else {
      // If the org is private, we can't link to it
      orgUrl = undefined;
    }
  }
  // return the url
  return orgUrl;
}
