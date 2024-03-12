import { hasMapQuestion } from "../../../src/surveys/utils/has-map-question";

describe("hasMapQuestion", () => {
  it("correctly identifies presence of map question", () => {
    const result = hasMapQuestion([
      {
        id: "some id",
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
    ]);

    expect(result).toBeTruthy();
  });
});
