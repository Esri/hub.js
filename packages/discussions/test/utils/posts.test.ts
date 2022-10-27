import { IItem } from "@esri/arcgis-rest-portal";
import { IGroup, IUser } from "@esri/arcgis-rest-types";
import { IDiscussionParams, IPost, IChannel } from "../../src/types";
import { IHubContent } from "@esri/hub-common";
import {
  isDiscussable,
  parseDiscussionURI,
  canModifyPost,
  canModifyPostStatus,
  canDeletePost,
  parseMentionedUsers,
} from "../../src/utils/posts";
import { MENTION_ATTRIBUTE, CANNOT_DISCUSS } from "../../src/utils/constants";
import * as viewGroup from "../../../common/test/mocks/groups/view-group.json";
import * as formItem from "../../../common/test/mocks/items/form-item-draft.json";
import * as channelUtils from "../../src/utils/channels";

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

describe("canModifyPost", () => {
  it("returns true when the user created the post", () => {
    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user1" } as IUser;
    const result = canModifyPost(post, user);
    expect(result).toBe(true);
  });

  it("returns false when user did not create the post", () => {
    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user2" } as IUser;
    const result = canModifyPost(post, user);
    expect(result).toBe(false);
  });
});

describe("canModifyPostStatus", () => {
  it("returns true when user can modify channel", () => {
    const canModifyChannelSpy = spyOn(
      channelUtils,
      "canModifyChannel"
    ).and.returnValue(true);
    const user = { username: "user2" } as IUser;
    const channel = { id: "channel1" } as IChannel;
    const result = canModifyPostStatus(channel, user);
    expect(result).toBe(true);
    expect(canModifyChannelSpy).toHaveBeenCalledTimes(1);
    expect(canModifyChannelSpy).toHaveBeenCalledWith(channel, user);
  });

  it("returns false when user cannot modify channel", () => {
    const canModifyChannelSpy = spyOn(
      channelUtils,
      "canModifyChannel"
    ).and.returnValue(false);
    const user = { username: "user2" } as IUser;
    const channel = { id: "channel1" } as IChannel;
    const result = canModifyPostStatus(channel, user);
    expect(result).toBe(false);
    expect(canModifyChannelSpy).toHaveBeenCalledTimes(1);
    expect(canModifyChannelSpy).toHaveBeenCalledWith(channel, user);
  });
});

describe("canDeletePost", () => {
  it("returns true when the user created the post", () => {
    const canModifyChannelSpy = spyOn(channelUtils, "canModifyChannel");
    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user1" } as IUser;
    const channel = { id: "channel1" } as IChannel;
    const result = canDeletePost(post, channel, user);
    expect(result).toBe(true);
    expect(canModifyChannelSpy).not.toHaveBeenCalled();
  });

  it("returns when user can modify channel", () => {
    const canModifyChannelSpy = spyOn(
      channelUtils,
      "canModifyChannel"
    ).and.returnValue(true);
    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user2" } as IUser;
    const channel = { id: "channel1" } as IChannel;
    const result = canDeletePost(post, channel, user);
    expect(result).toBe(true);
    expect(canModifyChannelSpy).toHaveBeenCalledTimes(1);
    expect(canModifyChannelSpy).toHaveBeenCalledWith(channel, user);
  });

  it("returns false when user did not create the post and user cannot modify channel", () => {
    const canModifyChannelSpy = spyOn(
      channelUtils,
      "canModifyChannel"
    ).and.returnValue(false);
    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user2" } as IUser;
    const channel = { id: "channel1" } as IChannel;
    const result = canDeletePost(post, channel, user);
    expect(result).toBe(false);
    expect(canModifyChannelSpy).toHaveBeenCalledTimes(1);
    expect(canModifyChannelSpy).toHaveBeenCalledWith(channel, user);
  });
});

describe("MENTION_ATTRIBUTE", () => {
  it("should be defined", () => {
    expect(MENTION_ATTRIBUTE).toBeDefined();
    expect(MENTION_ATTRIBUTE).toEqual("data-mention");
  });
});

describe("parseMentionedUsers", () => {
  it("should return an empty array when the text is falsy", () => {
    expect(parseMentionedUsers()).toEqual([]);
  });

  it("should parse unique usernames from data attributes in provided text", () => {
    const text = `
      <p>
        Hello <span data-mention="juliana_pa">@juliana_pa</span>!
        <br />
        How are you <em data-mention="paige_pa">@paige_pa</em>?
        <br />
        How about you <strong data-mention="cory_pa">@cory_pa</strong>?
        <br />
        And back to you <b data-mention="juliana_pa">@juliana_pa</b>
      </p>
    `;
    expect(parseMentionedUsers(text)).toEqual([
      "juliana_pa",
      "paige_pa",
      "cory_pa",
    ]);
  });
});
