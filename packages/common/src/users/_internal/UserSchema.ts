import { IConfigurationSchema } from "../../core";

export type UserEditorType = (typeof UserEditorTypes)[number];
export const UserEditorTypes = ["hub:user:settings"] as const;

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
        termsAndConditions: {
          type: "string",
          default: "",
        },
        signupText: {
          type: "string",
          default: "",
        },
      },
    },
  },
};
