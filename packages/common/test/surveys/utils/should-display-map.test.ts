import { IItem } from "@esri/arcgis-rest-portal";
import { shouldDisplayMap } from "../../../src/surveys/utils/should-display-map";
import { MAP_SURVEY_TYPEKEYWORD } from "../../../src/surveys/constants";

describe("shouldDisplayMap", () => {
  it("returns true when type is form and typeKeywords includes MAP_SURVEY_KEYWORD", () => {
    const result = shouldDisplayMap({
      type: "Form",
      typeKeywords: [MAP_SURVEY_TYPEKEYWORD],
    } as IItem);
    expect(result).toBeTruthy();
  });

  it("else returns false", () => {
    const result = shouldDisplayMap({
      type: "Form",
      typeKeywords: [],
    } as any as IItem);
    expect(result).toBeFalsy();
  });
});
