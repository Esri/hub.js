import { IConfigurationSchema } from "../../core/schemas/types";

/**
 * Defines the JSON schema for a Hub User's editable fields.
 */
export const UserSchema: IConfigurationSchema = {
  type: "object",
  properties: {
    settings: {
      type: "object",
      properties: {
        features: {
          type: "object",
          properties: {
            workspace: {
              type: "boolean",
              default: true,
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
