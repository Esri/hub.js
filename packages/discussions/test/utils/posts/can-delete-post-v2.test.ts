import { IUser } from "@esri/arcgis-rest-types";
import { AclCategory, IChannelV2, IPost, Role } from "../../../src/types";
import { canDeletePostV2 } from "../../../src/utils/posts";
import { ChannelPermission } from "../../../src/utils/channel-permission";
import * as portalPrivModule from "../../../src/utils/portal-privilege";

describe("canDeletePostV2", () => {
  let hasOrgAdminUpdateRightsSpy: jasmine.Spy;
  let canModerateChannelSpy: jasmine.Spy;

  beforeAll(() => {
    hasOrgAdminUpdateRightsSpy = spyOn(
      portalPrivModule,
      "hasOrgAdminUpdateRights"
    );
    canModerateChannelSpy = spyOn(
      ChannelPermission.prototype,
      "canModerateChannel"
    );
  });

  beforeEach(() => {
    hasOrgAdminUpdateRightsSpy.calls.reset();
    canModerateChannelSpy.calls.reset();
  });

  it("returns true when the user created the post", () => {
    hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
    canModerateChannelSpy.and.returnValue(false);

    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user1" } as IUser;
    const channel = { id: "channel1" } as IChannelV2;

    const result = canDeletePostV2(post, channel, user);
    expect(result).toBe(true);

    expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(0);
    expect(canModerateChannelSpy).not.toHaveBeenCalled();
  });

  it("throws error if user did not create the post and channel.channelAcl is undefined", async () => {
    hasOrgAdminUpdateRightsSpy.and.callFake(() => false);

    const post = { id: "post1", creator: "user1" } as IPost;
    const user = {} as IUser;
    const channel = {
      channelAcl: undefined,
    } as IChannelV2;

    expect(() => canDeletePostV2(post, channel, user)).toThrow(
      new Error("channel.channelAcl is required for ChannelPermission checks")
    );
  });

  it("returns true when user did not create the post but user is org_admin", () => {
    hasOrgAdminUpdateRightsSpy.and.callFake(() => true);
    canModerateChannelSpy.and.returnValue(false);

    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user2", role: "org_admin" } as IUser;
    const channel = {
      id: "channel1",
      channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
    } as IChannelV2;

    const result = canDeletePostV2(post, channel, user);
    expect(result).toBe(true);

    expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(1);
    const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.calls.allArgs()[0]; // args for 1st call
    expect(arg1).toBe(user);
    expect(arg2).toBe(channel.orgId);

    expect(canModerateChannelSpy).toHaveBeenCalledTimes(0);
  });

  it("returns true when user did not create the post and canModerateChannel returns true", () => {
    hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
    canModerateChannelSpy.and.returnValue(true);

    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user2" } as IUser;
    const channel = {
      id: "channel1",
      channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
    } as IChannelV2;

    const result = canDeletePostV2(post, channel, user);
    expect(result).toBe(true);

    expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(1);
    const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.calls.allArgs()[0]; // args for 1st call
    expect(arg1).toBe(user);
    expect(arg2).toBe(channel.orgId);

    expect(canModerateChannelSpy).toHaveBeenCalledTimes(1);
    expect(canModerateChannelSpy).toHaveBeenCalledWith(user);
  });

  it("returns false when user did not create the post and canModerateChannel returns false", () => {
    hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
    canModerateChannelSpy.and.returnValue(false);

    const post = { id: "post1", creator: "user1" } as IPost;
    const user = { username: "user2" } as IUser;
    const channel = {
      id: "channel1",
      channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
    } as IChannelV2;

    const result = canDeletePostV2(post, channel, user);
    expect(result).toBe(false);

    expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(1);
    const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.calls.allArgs()[0]; // args for 1st call
    expect(arg1).toBe(user);
    expect(arg2).toBe(channel.orgId);

    expect(canModerateChannelSpy).toHaveBeenCalledTimes(1);
    expect(canModerateChannelSpy).toHaveBeenCalledWith(user);
  });
});
