import { IConfigurationSchema } from "../../core";

export type UserEditorType = (typeof UserEditorTypes)[number];
export const UserEditorTypes = ["hub:user:settings"] as const;

export const UserSchema: IConfigurationSchema = {
  type: "object",
  properties: {
    _userSettings: {
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
    _portal: {
      type: "object",
      properties: {
        portalProperties: {
          type: "object",
          properties: {
            hub: {
              type: "object",
              properties: {
                settings: {
                  type: "object",
                  properties: {
                    informationBanner: {
                      type: "boolean",
                      default: false,
                    },
                  },
                },
              },
            },
          },
        },
        signinSettings: {
          type: "object",
          properties: {
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
    },
  },
};
