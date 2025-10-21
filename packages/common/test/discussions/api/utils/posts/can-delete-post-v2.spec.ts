import type { IUser } from "@esri/arcgis-rest-portal";
import {
  AclCategory,
  IChannel,
  IPost,
  Role,
} from "../../../../../src/discussions/api/types";
import { canDeletePostV2 } from "../../../../../src/discussions/api/utils/posts/can-delete-post-v2";
import { ChannelPermission } from "../../../../../src/discussions/api/utils/channel-permission";
import * as portalPrivModule from "../../../../../src/discussions/api/utils/portal-privilege";
import { vi, afterEach, describe, it, expect } from "vitest";

describe("canDeletePostV2", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns true when the user created the post", () => {
    const hasOrgAdminUpdateRightsSpy = vi.spyOn(
      portalPrivModule,
      "hasOrgAdminUpdateRights"
    );
    const canModerateChannelSpy = vi.spyOn(
      ChannelPermission.prototype,
      "canModerateChannel"
    );
    hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
    canModerateChannelSpy.mockReturnValue(false);

    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user1" } as IUser;
    const channel = { id: "channel1" } as IChannel;

    const result = canDeletePostV2(post, channel, user);
    expect(result).toBe(true);

    expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(0);
    expect(canModerateChannelSpy).not.toHaveBeenCalled();
  });

  it("throws error if user did not create the post and channel.channelAcl is undefined", async () => {
    const hasOrgAdminUpdateRightsSpy = vi.spyOn(
      portalPrivModule,
      "hasOrgAdminUpdateRights"
    );
    hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);

    const post = { id: "post1", creator: "user1" } as IPost;
    const user = {} as IUser;
    const channel = {
      channelAcl: undefined,
    } as IChannel;

    expect(() => canDeletePostV2(post, channel, user)).toThrow(
      new Error("channel.channelAcl is required for ChannelPermission checks")
    );
  });

  it("returns true when user did not create the post but user is org_admin", () => {
    const hasOrgAdminUpdateRightsSpy = vi.spyOn(
      portalPrivModule,
      "hasOrgAdminUpdateRights"
    );
    const canModerateChannelSpy = vi.spyOn(
      ChannelPermission.prototype,
      "canModerateChannel"
    );
    hasOrgAdminUpdateRightsSpy.mockImplementation(() => true);
    canModerateChannelSpy.mockReturnValue(false);

    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user2", role: "org_admin" } as IUser;
    const channel = {
      id: "channel1",
      channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
    } as IChannel;

    const result = canDeletePostV2(post, channel, user);
    expect(result).toBe(true);

    expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);
    const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.mock.calls[0]; // args for 1st call
    expect(arg1).toBe(user);
    expect(arg2).toBe(channel.orgId);

    expect(canModerateChannelSpy).toHaveBeenCalledTimes(0);
  });

  it("returns true when user did not create the post and canModerateChannel returns true", () => {
    const hasOrgAdminUpdateRightsSpy = vi.spyOn(
      portalPrivModule,
      "hasOrgAdminUpdateRights"
    );
    const canModerateChannelSpy = vi.spyOn(
      ChannelPermission.prototype,
      "canModerateChannel"
    );
    hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
    canModerateChannelSpy.mockReturnValue(true);

    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user2" } as IUser;
    const channel = {
      id: "channel1",
      channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
    } as IChannel;

    const result = canDeletePostV2(post, channel, user);
    expect(result).toBe(true);

    expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);
    const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.mock.calls[0]; // args for 1st call
    expect(arg1).toBe(user);
    expect(arg2).toBe(channel.orgId);

    expect(canModerateChannelSpy).toHaveBeenCalledTimes(1);
    expect(canModerateChannelSpy).toHaveBeenCalledWith(user);
  });

  it("returns false when user did not create the post and canModerateChannel returns false", () => {
    const hasOrgAdminUpdateRightsSpy = vi.spyOn(
      portalPrivModule,
      "hasOrgAdminUpdateRights"
    );
    const canModerateChannelSpy = vi.spyOn(
      ChannelPermission.prototype,
      "canModerateChannel"
    );
    hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
    canModerateChannelSpy.mockReturnValue(false);

    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user2" } as IUser;
    const channel = {
      id: "channel1",
      channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
    } as IChannel;

    const result = canDeletePostV2(post, channel, user);
    expect(result).toBe(false);

    expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);
    const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.mock.calls[0]; // args for 1st call
    expect(arg1).toBe(user);
    expect(arg2).toBe(channel.orgId);

    expect(canModerateChannelSpy).toHaveBeenCalledTimes(1);
    expect(canModerateChannelSpy).toHaveBeenCalledWith(user);
  });

  it("returns false when user is undefined", () => {
    const hasOrgAdminUpdateRightsSpy = vi.spyOn(
      portalPrivModule,
      "hasOrgAdminUpdateRights"
    );
    const canModerateChannelSpy = vi.spyOn(
      ChannelPermission.prototype,
      "canModerateChannel"
    );
    hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
    canModerateChannelSpy.mockReturnValue(false);

    const post = { id: "post1", creator: "user1" } as IPost;
    const user = undefined as IUser;
    const channel = {
      id: "channel1",
      channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      orgId: "aaa",
    } as IChannel;

    const result = canDeletePostV2(post, channel, user);
    expect(result).toBe(false);

    expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);
    const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.mock.calls[0]; // args for 1st call
    expect(arg1).toEqual({});
    expect(arg2).toBe(channel.orgId);

    expect(canModerateChannelSpy).toHaveBeenCalledTimes(1);
    const [canModerateArg1] = canModerateChannelSpy.mock.calls[0]; // args for 1st call
    expect(canModerateArg1).toEqual({});
  });
});
