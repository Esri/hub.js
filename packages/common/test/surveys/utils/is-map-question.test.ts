import { isMapQuestion } from "../../../src/surveys/utils/is-map-question";

describe("isMapQuestion", () => {
  it("correctly identifies map question when maps are set", () => {
    const result = isMapQuestion({
      id: "some id",
      type: "esriQuestionTypePolygon",
      maps: [
        {
          type: "map type",
          itemId: "an id",
          name: "a map",
        },
      ],
    });

    expect(result).toBeTruthy();
  });

  it("correctly identifies map question when defaultMap is set", () => {
    const result = isMapQuestion({
      id: "some id",
      type: "esriQuestionTypePolygon",
      defaultMap: "a map",
    });

    expect(result).toBeTruthy();
  });

  it("correctly indicates non-map question", () => {
    const result = isMapQuestion({
      id: "some id",
      type: "esriQuestionTypePage",
    });

    expect(result).toBeFalsy();
  });
});
