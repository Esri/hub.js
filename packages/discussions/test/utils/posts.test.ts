import { IItem } from "@esri/arcgis-rest-portal";
import { IGroup } from "@esri/arcgis-rest-types";
import { IDiscussionParams } from "../../src/types";
import { IHubContent } from "@esri/hub-common";
import {
  isGroupDiscussable,
  isItemDiscussable,
  isDiscussable,
  parseDiscussionURI,
} from "../../src/utils/posts";
import * as viewGroup from "../../../common/test/mocks/groups/view-group.json";
import * as formItem from "../../../common/test/mocks/items/form-item-draft.json";

describe("parseDiscussionURI", () => {
  it("returns DiscussionParams for valid discussion uri", () => {
    const discussion = "hub://dataset/1234_1/?id=1,2,3&attribute=foo";
    const expected = {
      source: "hub",
      type: "dataset",
      id: "1234",
      layer: "1",
      features: "1,2,3".split(","),
      attribute: "foo",
    } as IDiscussionParams;

    expect(parseDiscussionURI(discussion)).toEqual(expected);
  });

  it("defaults layer to null", () => {
    const discussion = "hub://dataset/1234/";
    const expected = {
      source: "hub",
      type: "dataset",
      id: "1234",
      layer: null,
      features: null,
      attribute: null,
    } as IDiscussionParams;

    expect(parseDiscussionURI(discussion)).toEqual(expected);
  });

  it("returns DiscussionParams for invalid discussion uri", () => {
    const discussion = "hub://dataset";
    const expected = {
      source: "hub",
      type: "dataset",
      id: null,
      layer: null,
      features: null,
      attribute: null,
    } as IDiscussionParams;

    expect(parseDiscussionURI(discussion)).toEqual(expected);
  });

  it("throws when given invalid url string", () => {
    const discussion = "hubdataset";

    expect(() => parseDiscussionURI(discussion)).toThrowError();
  });
});

describe("isGroupDiscussable", () => {
  it("returns true", () => {
    const group = { id: "foo" } as IGroup;
    expect(isGroupDiscussable(group)).toBeTruthy();
  });
});

describe("isItemDiscussable", () => {
  it("returns true", () => {
    const item = { id: "foo" } as IItem;
    expect(isItemDiscussable(item)).toBeTruthy();
  });
});

describe("isDiscussable", () => {
  it("returns true for an IGroup", () => {
    const group = viewGroup as IGroup;
    expect(isDiscussable(group)).toBeTruthy();
  });

  it("returns true for an IItem", () => {
    const item = formItem as IItem;
    expect(isDiscussable(item)).toBeTruthy();
  });

  it("returns true for an IHubContent", () => {
    const content = formItem as unknown as IHubContent;
    expect(isDiscussable(content)).toBeTruthy();
  });
});
