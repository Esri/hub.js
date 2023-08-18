import { IUiSchema } from "../../types";

export const uiSchema: IUiSchema = {
  type: 'Layout',
  elements: [
    {
      scope: "/properties/cardTitle",
      type: 'Control',
      label: "Title"
    },
    {
      scope: "/properties/countdownDate",
      type: 'Control',
      label: "Countdown Date",
      options: {
        control: 'hub-field-input-date'
      }
    }
  ]
}