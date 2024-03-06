import { IS123FormJSON } from "../../../src/surveys/types";
import { decodeForm } from "../../../src/surveys/utils/decode-form";

describe("decodeForm", () => {
  const form: IS123FormJSON = {
    header: {
      content:
        "%3Cp%20title%3D'Whos%20the%20best%20cat'%3EWhos%20the%20best%20cat%3C%2Fp%3E",
    },
    subHeader: {
      content: "This%20is%20encoded",
    },
    footer: {
      content: "This%20is%20encoded",
    },
    questions: [
      {
        id: "some id",
        type: "esriQuestionTypePage",
        questions: [
          {
            description: "This%20is%20encoded",
            id: "some id",
            type: "esriQuestionTypePage",
          },
          {
            id: "some id",
            type: "esriQuestionTypePage",
          },
        ],
      },
    ],
    settings: {
      thankYouScreenContent: "This%20is%20encoded",
    },
  };

  it("decodes form into HTML", () => {
    const result: IS123FormJSON = decodeForm(form);
    expect(result).toEqual({
      header: {
        content: "<p title='Whos the best cat'>Whos the best cat</p>",
      },
      subHeader: {
        content: "This is encoded",
      },
      footer: {
        content: "This is encoded",
      },
      questions: [
        {
          id: "some id",
          type: "esriQuestionTypePage",
          questions: [
            {
              description: "This is encoded",
              id: "some id",
              type: "esriQuestionTypePage",
            },
            {
              id: "some id",
              type: "esriQuestionTypePage",
            },
          ],
        },
      ],
      settings: {
        thankYouScreenContent: "This is encoded",
      },
    });
  });
});
