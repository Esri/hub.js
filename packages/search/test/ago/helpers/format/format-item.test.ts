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
  size: 1,
  extent: [
    [1, 2],
    [3, 4],
  ],
};

describe("highlights test", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {}); // suppress console output
  });
  it("formats item into v3 style dataset", () => {
    const item: IItem = { ...itemProps };
    const query = "fake";
    const actual = formatItem(item, query);
    const expected = {
      id: "1ef",
      type: "item",
      attributes: {
        ...itemProps,
        name: "fake item",
        searchDescription: "fake description",
        hubType: "dataset",
        collection: ["Dataset"],
        extent: {
          coordinates: [
            [1, 2],
            [3, 4],
          ],
          type: "envelope",
        },
      },
      meta: {
        highlights: {
          name: '<mark class="hub-search-highlight name-highlight">fake</mark> item',
          searchDescription:
            '<mark class="hub-search-highlight description-highlight">fake</mark> description',
        },
      },
    };
    expect(actual).toEqual(expected);
  });

  it("formats item into v3 style dataset without highlights when query is blank", () => {
    const item: IItem = { ...itemProps };
    const query = "";
    const actual = formatItem(item, query);
    const expected = {
      id: "1ef",
      type: "item",
      attributes: {
        ...itemProps,
        name: "fake item",
        searchDescription: "fake description",
        hubType: "dataset",
        collection: ["Dataset"],
        extent: {
          coordinates: [
            [1, 2],
            [3, 4],
          ],
          type: "envelope",
        },
      },
    };
    expect(actual).toEqual(expected);
  });

  it("formats item into v3 style dataset when hubType is Other", () => {
    const item: IItem = { ...itemProps, type: "unknown type" };
    const query = "";
    const actual = formatItem(item, query);
    const expected = {
      id: "1ef",
      type: "item",
      attributes: {
        ...itemProps,
        type: "unknown type",
        name: "fake item",
        searchDescription: "fake description",
        hubType: "Other",
        collection: ["Other"],
        extent: {
          coordinates: [
            [1, 2],
            [3, 4],
          ],
          type: "envelope",
        },
      },
    };
    expect(actual).toEqual(expected);
  });
});
