import { IUiSchemaElement } from "../types";

export const getSlugSchemaElement = (i18nScope: string): IUiSchemaElement => {
  return {
    labelKey: `${i18nScope}.fields.slug.label`,
    scope: "/properties/_slug",
    type: "Control",
    options: {
      control: "hub-field-input-input",
      messages: [
        {
          type: "ERROR",
          keyword: "pattern",
          icon: true,
          labelKey: `${i18nScope}.fields.slug.patternError`,
        },
        {
          type: "ERROR",
          keyword: "isUniqueSlug",
          icon: true,
          labelKey: `${i18nScope}.fields.slug.isUniqueError`,
        },
      ],
    },
  };
};
