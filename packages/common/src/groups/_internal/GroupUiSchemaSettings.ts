import { IUiSchema } from "../../core";

/**
 * Complete settings uiSchema for Hub Groups - this defines
 * how the schema properties should be rendered in the
 * group settings experience
 */
export const uiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      type: "Section",
      labelKey: "{{i18nScope}}.sections.membershipAccess.label",
      elements: [
        {
          labelKey: "{{i18nScope}}.fields.membershipAccess.label",
          scope: "/properties/membershipAccess",
          type: "Control",
          options: {
            control: "hub-field-input-radio",
            labels: [
              "{{i18nScope}}.fields.membershipAccess.org.label",
              "{{i18nScope}}.fields.membershipAccess.collab.label",
              "{{i18nScope}}.fields.membershipAccess.any.label",
            ],
          },
        },
        {
          labelKey: "{{i18nScope}}.fields.contributeContent.label",
          scope: "/properties/isViewOnly",
          type: "Control",
          options: {
            control: "hub-field-input-radio",
            labels: [
              "{{i18nScope}}.fields.contributeContent.all.label",
              "{{i18nScope}}.fields.contributeContent.admins.label",
            ],
          },
        },
      ],
    },
  ],
};
