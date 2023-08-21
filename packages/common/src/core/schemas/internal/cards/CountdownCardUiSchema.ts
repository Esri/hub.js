import { IUiSchema } from "../../types";

export const uiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      scope: "/properties/cardTitle",
      type: "Control",
      label: "Title",
    },
    {
      type: "Slot",
      options: {
        name: "test-slot",
      },
    },
    {
      type: "Section",
      label: "TEST SECTION",
      elements: [
        {
          type: "Slot",
          options: {
            name: "test-slot2",
          },
        },
      ],
    },
    {
      scope: "/properties/countdownDate",
      type: "Control",
      label: "Countdown Date",
      options: {
        control: "hub-field-input-date",
      },
    },
  ],
};
