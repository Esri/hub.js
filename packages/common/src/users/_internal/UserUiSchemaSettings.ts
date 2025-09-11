import type { IArcGISContext } from "../../types/IArcGISContext";
import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import { fetchOrg } from "../../org/fetch-org";
import { failSafe } from "../../utils/fail-safe";
import { getPortalSettings, IPortal } from "@esri/arcgis-rest-portal";
import { getWithDefault } from "../../objects/get-with-default";

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
  let noticeMessage = `{{${i18nScope}.notice.message:translate}}`;
  // default notice action - "Go to organization settings"
  const orgNoticeActions = [
    {
      ariaLabel: `{{${i18nScope}.notice.actions.goToOrg:translate}}`,
      label: `{{${i18nScope}.notice.actions.goToOrg:translate}}`,
      href: `${context.portalUrl}/home/organization.html?tab=general#settings`,
      target: "_blank",
    },
  ];

  // we have to make this xhr to fetch the portal settings to determine if
  // the banner is enabled as it's only exposed in appSettings/ember
  const portalSettings = (await _getPortalSettings(context)) as IPortal;
  const hasBanner = getWithDefault(
    portalSettings,
    "informationalBanner.enabled",
    false
  ) as boolean;
  const bannerString = hasBanner
    ? `{{${i18nScope}.fields.infoBanner.helperText:translate}}`
    : `{{${i18nScope}.fields.infoBanner.helperTextWhenDisabled:translate}}`;
  const configureBannerString = `{{${i18nScope}.fields.infoBanner.goToBannerConfig:translate}}`;
  const showInfoBannerLink = `<calcite-link href=${context.portalUrl}/home/organization.html?tab=security#settings target="_blank" icon-end="launch">${configureBannerString}</calcite-link>`;

  /**
   * If there is a community org relationship, or we are in a community
   * org with an enterprise org relationship, show another action that
   * links out to the corresponding relationship org ("Go to community
   * organization" or "Go to staff organization")
   */
  /** Since there can be misconfigurations in orgs, we can't just trust
   * that having communityOrgId or enterpriseOrgId means the orgs are
   * correctly configured - so we need to do some deep checks in the
   * context.trustedOrgs array to verify the relationships are  present
   * and valid before we show the extra action link.
   */
  // Get either the community or enterprise org id (only one will be defined)
  const orgId = context.enterpriseOrgId || context.communityOrgId;
  // then we get the associated org info from the trustedOrgs array
  const associatedOrg = context.trustedOrgs.find(
    (org) => org.to.orgId === orgId
  );

  // If we have both, then we have a valid relationship and can show the actions
  if (orgId && associatedOrg) {
    // We want to always show the associated org name in the notice, if there is one
    const associatedOrgName = associatedOrg.to.name;
    const actionLabelKey = context.enterpriseOrgId
      ? "goToStaffOrg"
      : "goToCommunityOrg";
    // get the org url we will include in the notice action
    const orgUrl = await _getCommunityOrEnterpriseAGOUrl(context);

    // update the notice message with the associated org name
    noticeMessage = context.enterpriseOrgId
      ? `{{${i18nScope}.notice.staffMessage:translate}}: ${associatedOrgName}`
      : `{{${i18nScope}.notice.communityMessage:translate}}: ${associatedOrgName}`;
    // add the community org action if there is an org url
    if (orgUrl) {
      orgNoticeActions.push({
        ariaLabel: `{{${i18nScope}.notice.actions.${actionLabelKey}:translate}}`,
        label: `{{${i18nScope}.notice.actions.${actionLabelKey}:translate}}`,
        href: orgUrl,
        target: "_blank",
      });
    }
  }
  // Likely misconfiguration if we have an orgId but no associatedOrg from the trustedOrgs array
  if (orgId && !associatedOrg) {
    let targetOrg = "Community";
    if (context.enterpriseOrgId) {
      targetOrg = "Staff";
    }

    console.warn(
      `Links to the ${targetOrg} Org could not be displayed. There appears to be a misconfiguration in the trusted org relationships for this organization. Please contact Esri Customer Service for assistance.`
    );
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
              "/properties/settings/properties/features/properties/workspace",
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
        labelKey: `${i18nScope}.sections.orgSettings.label`,
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
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.orgSettings.siteDefaults.label`,
            elements: [
              {
                type: "Control",
                scope:
                  "/properties/hubOrgSettings/properties/showInformationalBanner",
                labelKey: `${i18nScope}.fields.infoBanner.label`,
                options: {
                  type: "Control",
                  control: "hub-field-input-switch",
                  layout: "inline-space-between",
                  helperText: {
                    label: bannerString,
                  },
                },
                rules: [
                  {
                    effect: UiSchemaRuleEffects.DISABLE,
                    conditions: [!portalSettings.informationalBanner?.enabled],
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
                    label: showInfoBannerLink,
                  },
                },
                rules: [
                  {
                    effect: UiSchemaRuleEffects.SHOW,
                    conditions: [context.isOrgAdmin],
                  },
                ],
              },
            ],
          },
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.orgSettings.signinSettings.label`,
            rules: [
              {
                effect: UiSchemaRuleEffects.SHOW,
                conditions: [
                  // only if in community org and admin of the org
                  !!(context.isCommunityOrg && context.isOrgAdmin),
                ],
              },
            ],
            options: {
              helperText: {
                labelKey: `${i18nScope}.sections.orgSettings.signinSettings.helperText`,
              },
            },
            elements: [
              {
                type: "Control",
                scope:
                  "/properties/hubOrgSettings/properties/enableTermsAndConditions",
                labelKey: `${i18nScope}.fields.enableTermsAndConditions.label`,
                options: {
                  control: "hub-field-input-switch",
                  layout: "inline-space-between",
                },
              },
              {
                type: "Control",
                scope:
                  "/properties/hubOrgSettings/properties/termsAndConditions",
                labelKey: `${i18nScope}.fields.termsAndConditions.label`,
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
                scope: "/properties/hubOrgSettings/properties/enableSignupText",
                labelKey: `${i18nScope}.fields.enableSignupText.label`,
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
  };
};

async function _getCommunityOrEnterpriseAGOUrl(
  context: IArcGISContext
): Promise<string> {
  let orgUrl = `${context.communityOrgUrl}/home/index.html`;
  // if there's an enterprise org, we need to fetch it to get the url
  if (context.enterpriseOrgId) {
    // Fail safe fetch the e-org
    const fsGetOrg = failSafe(fetchOrg, {});
    const org = (await fsGetOrg(
      context.enterpriseOrgId,
      context.requestOptions
    )) as {
      urlKey?: string;
      customBaseUrl?: string;
    };
    // If the org response has a urlKey it is a real response. If the urlKey is missing the org is private
    if (org.urlKey) {
      // construct the url
      orgUrl = `https://${org.urlKey}.${org.customBaseUrl}/home/index.html`;
    } else {
      // If the org is private, we can't link to it
      orgUrl = undefined;
    }
  }
  // return the url
  return orgUrl;
}

/**
 * Fetches the portal settings in a fail-safe manner.
 *
 * @param context - The context containing the ArcGIS portal information.
 * @returns A promise that resolves to the portal settings.
 */
export async function _getPortalSettings(
  context: IArcGISContext
): Promise<any> {
  // Fail safe fetch the portal settings
  const fsGetPortalSettings = failSafe(getPortalSettings, {});
  const settings = await fsGetPortalSettings(context.portal.id, {
    portal: context.sharingApiUrl,
  });
  return settings;
}
