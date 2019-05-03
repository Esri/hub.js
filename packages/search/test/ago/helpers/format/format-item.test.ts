import { formatItem } from "../../../../src/ago/helpers/format/format-item";
import { IItem } from "@esri/arcgis-rest-portal";

const itemProps = {
  id: "1ef",
  title: "fake item",
  description: "fake description",
  owner: "owner",
  modified: 12345678,
  tags: ["a", "b"],
  created: 12345678,
  type: "feature layer",
  numViews: 1000,
  size: 1
};

describe("highlights test", () => {
  it("formats item into v3 style dataset", () => {
    const item: IItem = Object.assign({}, itemProps);
    const query = "fake";
    const actual = formatItem(item, query);
    const expected = {
      id: "1ef",
      type: "item",
      attributes: Object.assign(itemProps, {
        name: "fake item",
        searchDescription: "fake description",
        hubType: "dataset"
      }),
      meta: {
        highlights: {
          name:
            '<mark class="hub-search-highlight name-highlight">fake</mark> item',
          searchDescription:
            '<mark class="hub-search-highlight description-highlight">fake</mark> description'
        }
      }
    };
    expect(actual).toEqual(expected);
  });

  it("formats item into v3 style dataset without highlights when query is blank", () => {
    const item: IItem = Object.assign({}, itemProps);
    const query = "";
    const actual = formatItem(item, query);
    const expected = {
      id: "1ef",
      type: "item",
      attributes: Object.assign(itemProps, {
        name: "fake item",
        searchDescription: "fake description",
        hubType: "dataset"
      })
    };
    expect(actual).toEqual(expected);
  });
});
