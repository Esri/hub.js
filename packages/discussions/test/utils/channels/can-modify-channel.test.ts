import { IGroup } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  IChannel,
  IDiscussionsUser,
  Role,
  SharingAccess,
} from "../../../src/types";
import { canModifyChannel } from "../../../src/utils/channels";
import { ChannelPermission } from "../../../src/utils/channel-permission";

describe("canModerateChannel", () => {
  describe("With channelAcl Permissions", () => {
    let canModerateChannelSpy: jasmine.Spy;

    beforeAll(() => {
      canModerateChannelSpy = spyOn(
        ChannelPermission.prototype,
        "canModerateChannel"
      );
    });

    beforeEach(() => {
      canModerateChannelSpy.calls.reset();
    });

    it("return true if channelPermission.canModerateChannel is true", () => {
      canModerateChannelSpy.and.callFake(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.GROUP, role: Role.MANAGE }],
        creator: "john",
      } as IChannel;

      expect(canModifyChannel(channel, user)).toBe(true);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [arg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
    });

    it("return false if channelPermission.canModerateChannel is false", () => {
      canModerateChannelSpy.and.callFake(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canModifyChannel(channel, user)).toBe(false);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [arg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
    });
  });
});
