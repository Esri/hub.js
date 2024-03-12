import { isPageQuestion } from "../../../src/surveys/utils/is-page-question";

describe("isPageQuestion", () => {
  it("correctly identifies page question", () => {
    const result = isPageQuestion({
      id: "some id",
      type: "esriQuestionTypePage",
    });

    expect(result).toBeTruthy();
  });

  it("correctly indicates non-page question", () => {
    const result = isPageQuestion({
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

    expect(result).toBeFalsy();
  });
});
