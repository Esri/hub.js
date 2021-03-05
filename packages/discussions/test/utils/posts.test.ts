import { IItem } from "@esri/arcgis-rest-portal";
import { IGroup } from "@esri/arcgis-rest-types";
import { IDiscussionParams } from "../../src/types";
import {
  isGroupDiscussable,
  isItemDiscussable,
  parseDiscussionURI
} from "../../src/utils/posts";

describe("Util: parseDiscussionURI", () => {
  it("returns DiscussionParams for valid post discussion uri", () => {
    const discussion = "hub://dataset/1234_1/?id=1,2,3&attribute=foo";
    const expected = {
      source: "hub",
      type: "dataset",
      id: "1234",
      layer: "1",
      features: "1,2,3".split(","),
      attribute: "foo"
    } as IDiscussionParams;

    expect(parseDiscussionURI(discussion)).toEqual(expected);
  });

  it("returns DiscussionParams for invalid post discussion uri", () => {
    const discussion = "hub://dataset/";
    const expected = {
      source: "hub",
      type: "dataset",
      id: null,
      layer: null,
      features: null,
      attribute: null
    } as IDiscussionParams;

    expect(parseDiscussionURI(discussion)).toEqual(expected);
  });

  it("throws when given invalid url string", () => {
    const discussion = "hubdataset";

    expect(() => parseDiscussionURI(discussion)).toThrowError();
  });
});

describe("[GATE] isGroupDiscussable", () => {
  it("returns true", () => {
    const group = { id: "foo" } as IGroup;
    expect(isGroupDiscussable(group)).toBeTruthy();
  });
});

describe("[GATE] isItemDiscussable", () => {
  it("returns true", () => {
    const item = { id: "foo" } as IItem;
    expect(isItemDiscussable(item)).toBeTruthy();
  });
});
