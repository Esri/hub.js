import { IConfigurationSchema } from "../../core/schemas/types";

export type UserEditorType = (typeof UserEditorTypes)[number];
export const UserEditorTypes = ["hub:user:settings"] as const;

/**
 * Defines the JSON schema for a Hub User's editable fields.
 */
export const UserSchema: IConfigurationSchema = {
  type: "object",
  properties: {
    settings: {
      type: "object",
      properties: {
        preview: {
          type: "object",
          properties: {
            workspace: {
              type: "boolean",
              default: false,
            },
          },
        },
      },
    },
    hubOrgSettings: {
      type: "object",
      properties: {
        showInformationalBanner: {
          type: "boolean",
          default: false,
        },
        enableTermsAndConditions: {
          type: "boolean",
          default: false,
        },
        termsAndConditions: {
          type: "string",
          default: "",
        },
        enableSignupText: {
          type: "boolean",
          default: false,
        },
        signupText: {
          type: "string",
          default: "",
        },
      },
    },
  },
};
