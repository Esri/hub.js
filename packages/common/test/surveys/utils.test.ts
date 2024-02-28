import { IS123FormJSON, decodeForm } from "@esri/hub-common";

describe("survey utils", () => {
  describe("decodeForm", () => {
    const form: IS123FormJSON = {
      questions: [
        {
          header: {
            content: "%3Fx%3Dtest",
          },
          id: "some id 1",
          type: "esriQuestionTypePage",
          questions: [
            {
              id: "some id 2",
              type: "esriQuestionTypePage",
            },
          ],
        },
        {
          id: "some id 3",
          type: "esriQuestionTypePolyline",
          maps: [
            {
              type: "type",
              itemId: "some id 4",
              name: "map",
            },
          ],
        },
      ],
    };

    it("decodes form into HTML", () => {
      const result = decodeForm(form);
      expect(result).toEqual({
        questions: [
          {
            header: {
              content: "%3Fx%3Dtest",
            },
            id: "some id 1",
            type: "esriQuestionTypePage",
            questions: [
              {
                id: "some id 2",
                type: "esriQuestionTypePage",
              },
            ],
          },
          {
            id: "some id 3",
            type: "esriQuestionTypePolyline",
            maps: [
              {
                type: "type",
                itemId: "some id 4",
                name: "map",
              },
            ],
          },
        ],
      });
    });
  });
});
