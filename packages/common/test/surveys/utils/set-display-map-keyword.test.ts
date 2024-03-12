import { MAP_SURVEY_TYPEKEYWORD } from "../../../src/surveys/constants";
import { setDisplayMapKeyword } from "../../../src/surveys/utils/set-display-map-keyword";

describe("setDisplayMapKeyword", () => {
  it("adds map keyword", () => {
    const result = setDisplayMapKeyword([], true);
    expect(result).toEqual([MAP_SURVEY_TYPEKEYWORD]);
  });

  it("removes map keyword", () => {
    const result = setDisplayMapKeyword([MAP_SURVEY_TYPEKEYWORD], false);
    expect(result).toEqual([]);
  });

  it("handles null input", () => {
    const result = setDisplayMapKeyword(null as any, false);
    expect(result).toEqual([]);
  });
});
