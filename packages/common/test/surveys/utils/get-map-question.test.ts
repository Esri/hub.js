import { getMapQuestion } from "../../../src/surveys/utils/get-map-question";

describe("getMapQuestion", () => {
  it("gets map question", () => {
    const questions = [
      {
        id: "some id 4",
        type: "esriQuestionTypePage",
        questions: [
          {
            id: "some id",
            type: "invalid type",
          },
        ],
      },
      {
        id: "some id 1",
        type: "esriQuestionTypePage",
        questions: [
          {
            id: "some id 2",
            type: "esriQuestionTypePolygon",
            maps: [
              {
                type: "map type",
                itemId: "an id",
                name: "a map",
              },
            ],
            defaultMap: "a map",
          },
        ],
      },
      {
        id: "some id 3",
        type: "esriQuestionTypePage",
        questions: [],
      },
    ];

    const result = getMapQuestion(questions);
    expect(result).toEqual({
      id: "some id 2",
      type: "esriQuestionTypePolygon",
      maps: [
        {
          type: "map type",
          itemId: "an id",
          name: "a map",
        },
      ],
      defaultMap: "a map",
    });
  });

  it("handles null input", () => {
    const result = getMapQuestion([]);
    expect(result).toBeFalsy();
  });
});
