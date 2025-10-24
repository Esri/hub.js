import type { IUser } from "@esri/arcgis-rest-portal";
import {
  IChannel,
  IDiscussionsUser,
  IPost,
} from "../../../../../src/discussions/api//types";
import { canDeletePost } from "../../../../../src/discussions/api//utils/posts/can-delete-post";
import { ChannelPermission } from "../../../../../src/discussions/api//utils/channel-permission";
import { AclCategory } from "../../../../../src/discussions/api/enums/aclCategory";
import { Role } from "../../../../../src/discussions/api/enums/role";
import { describe, it, expect, vi } from "vitest";

describe("canDeletePost", () => {
  it("returns true when the user created the post", () => {
    const canModerateChannelSpy = vi.spyOn(
      ChannelPermission.prototype,
      "canModerateChannel"
    );
    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user1" } as IUser;
    const channel = { id: "channel1" } as IChannel;
    const result = canDeletePost(post, channel, user);
    expect(result).toBe(true);
    expect(canModerateChannelSpy).not.toHaveBeenCalled();
  });

  it("returns true when user did not create the post but user can moderate channel", () => {
    const canModerateChannelSpy = vi
      .spyOn(ChannelPermission.prototype, "canModerateChannel")
      .mockReturnValue(true);
    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user2" } as IUser;
    const channel = {
      id: "channel1",
      channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
    } as IChannel;
    const result = canDeletePost(post, channel, user);
    expect(result).toBe(true);
    expect(canModerateChannelSpy).toHaveBeenCalledTimes(1);
    expect(canModerateChannelSpy).toHaveBeenCalledWith(user);
  });

  it("returns true when user did not create the post but user is org_admin", () => {
    const canModerateChannelSpy = vi
      .spyOn(ChannelPermission.prototype, "canModerateChannel")
      .mockReturnValue(true);
    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user2", role: "org_admin" } as IUser;
    const channel = {
      id: "channel1",
      channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
    } as IChannel;
    const result = canDeletePost(post, channel, user);
    expect(result).toBe(true);
    expect(canModerateChannelSpy).toHaveBeenCalledTimes(0);
  });

  it("returns false when user did not create the post", () => {
    const canModerateChannelSpy = vi
      .spyOn(ChannelPermission.prototype, "canModerateChannel")
      .mockReturnValue(false);
    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user2" } as IUser;
    const channel = { id: "channel1" } as IChannel;
    const result = canDeletePost(post, channel, user);
    expect(result).toBe(false);
    expect(canModerateChannelSpy).toHaveBeenCalledTimes(0);
  });

  it("returns false when the user is unauthenticated", () => {
    const canModerateChannelSpy = vi
      .spyOn(ChannelPermission.prototype, "canModerateChannel")
      .mockReturnValue(false);
    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: null } as IDiscussionsUser;
    const channel = { id: "channel1" } as IChannel;
    const result = canDeletePost(post, channel, user);
    expect(result).toBe(false);
    expect(canModerateChannelSpy).toHaveBeenCalledTimes(0);
  });

  it("returns false when the user is undefined", () => {
    const canModerateChannelSpy = vi
      .spyOn(ChannelPermission.prototype, "canModerateChannel")
      .mockReturnValue(false);
    const post = { id: "post1", creator: "user1" } as IPost;
    const channel = { id: "channel1" } as IChannel;
    const result = canDeletePost(post, channel);
    expect(result).toBe(false);
    expect(canModerateChannelSpy).toHaveBeenCalledTimes(0);
  });
});
