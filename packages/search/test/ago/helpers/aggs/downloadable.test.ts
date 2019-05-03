import { downloadable } from "../../../../src/ago/helpers/aggs/downloadable";
import { ISearchResult, IItem } from "@esri/arcgis-rest-portal";

const unImportaantFields = {
  created: 1,
  modified: 1,
  numViews: 1,
  owner: "a",
  tags: ["a"],
  title: "b",
  size: 1
};

const response: ISearchResult<IItem> = {
  results: [
    {
      id: "1ef",
      type: "CSV",
      ...unImportaantFields
    },
    {
      id: "2ef",
      type: "GeoJson",
      ...unImportaantFields
    },
    {
      id: "3ef",
      typeKeywords: ["Data"],
      type: "GeoJson",
      ...unImportaantFields
    },
    {
      id: "4ef",
      type: "non-downloadable",
      ...unImportaantFields
    }
  ],
  query: "",
  start: 1,
  total: 4,
  num: 4,
  nextStart: -1
};

describe("downloadable aggs test", () => {
  it("calculates raw downloadable aggs correctly", () => {
    const actual = downloadable(response);
    const expected = { downloadable: { true: 3, false: 1 } };
    expect(actual).toEqual(expected);
  });
});
