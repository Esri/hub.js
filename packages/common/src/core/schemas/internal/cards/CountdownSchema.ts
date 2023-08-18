import { IConfigurationSchema } from "../../types";

export const CountdownSchema: IConfigurationSchema = {
  required: ['countdownDate'],
  type: 'object',
  properties: {
    cardTitle: {
      type: 'string'
    },
    countdownDate: {
      type: 'string',
      format: 'date'
    }
  }
};