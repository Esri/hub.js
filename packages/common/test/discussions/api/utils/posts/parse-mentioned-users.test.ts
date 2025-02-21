import { IGroup } from "@esri/arcgis-rest-portal";
import { parseMentionedUsers } from "../../../../../src/discussions/api//utils/posts";
import {
  CANNOT_DISCUSS,
  MENTION_ATTRIBUTE,
} from "../../../../../src/discussions/constants";
import { isDiscussable } from "../../../../../src/discussions/utils";
import * as viewGroup from "../../../../mocks/groups/view-group.json";

describe("parseMentionedUsers", () => {
  it("should return an empty array when the text is falsy", () => {
    expect(parseMentionedUsers()).toEqual([]);
  });

  it("should parse unique usernames from data attributes in provided text", () => {
    const text = `
      <p>
        Hello <span data-mention="juliana_pa">@juliana_pa</span>!
        <br />
        How are you <em data-mention="paige-pa">@paige-pa</em>?
        <br />
        How about you <strong data-mention="cory.pa">@cory.pa</strong>?
        <br />
        And you <b data-mention="chezelle@pa">@chezelle@pa</b>?
        <br />
        And back to you <b data-mention="juliana_pa">@juliana_pa</b>
      </p>
    `;
    expect(parseMentionedUsers(text)).toEqual([
      "juliana_pa",
      "paige-pa",
      "cory.pa",
      "chezelle@pa",
    ]);
  });
});

describe("isDiscussable", () => {
  it("returns true", () => {
    const group = {
      ...viewGroup,
      typeKeywords: [],
    } as any as IGroup;
    expect(isDiscussable(group)).toBeTruthy();
  });

  it("returns true when typeKeywords don't exist", () => {
    const group = {
      ...viewGroup,
      typeKeywords: undefined,
    } as any as IGroup;
    expect(isDiscussable(group)).toBeTruthy();
  });

  it("returns false", () => {
    const group = {
      ...viewGroup,
      typeKeywords: [CANNOT_DISCUSS],
    } as any as IGroup;
    expect(isDiscussable(group)).toBeFalsy();
  });
});

describe("MENTION_ATTRIBUTE", () => {
  it("should be defined", () => {
    expect(MENTION_ATTRIBUTE).toBeDefined();
    expect(MENTION_ATTRIBUTE).toEqual("data-mention");
  });
});
