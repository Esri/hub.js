import { IItem } from "@esri/arcgis-rest-portal";
import { IGroup, IUser } from "@esri/arcgis-rest-types";
import { IDiscussionParams, IPost, IChannel } from "../../src/types";
import { IHubContent } from "@esri/hub-common";
import {
  isDiscussable,
  parseDiscussionURI,
  canModifyPost,
  canDeletePost,
} from "../../src/utils/posts";
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

describe("canModifyPost", () => {
  it("returns true when the user created the post", () => {
    const canModifyChannelSpy = spyOn(channelUtils, "canModifyChannel");
    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user1" } as IUser;
    const channel = { id: "channel1" } as IChannel;
    const result = canModifyPost(post, channel, user);
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
    const result = canModifyPost(post, channel, user);
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
    const result = canModifyPost(post, channel, user);
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
