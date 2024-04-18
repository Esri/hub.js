import { IConfigurationSchema } from "../../core/schemas/types";

export const buildSchema = (): IConfigurationSchema => {
  return {
    properties: {
      allowRegistration: {
        type: "boolean",
        enum: [true, false],
        default: true,
      },
      notifyAttendees: {
        type: "boolean",
        enum: [true, false],
        default: true,
      },
    },
  } as IConfigurationSchema;
};
