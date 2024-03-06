import { IItem } from "@esri/arcgis-rest-portal";
import { isSurvey123Connect } from "../../../src/surveys/utils/is-survey123-connect";

describe("isSurvey123Connect", () => {
  it("correctly identifies survey123 connect form", () => {
    const result = isSurvey123Connect({
      typeKeywords: ["Survey123 Connect"],
    } as IItem);

    expect(result).toBeTruthy();
  });

  it("correctly indicates non-survey123 connect form", () => {
    const result = isSurvey123Connect({
      typeKeywords: [],
    } as any as IItem);

    expect(result).toBeFalsy();
  });

  it("handles null input", () => {
    const result = isSurvey123Connect(null as any);

    expect(result).toBeFalsy();
  });
});
