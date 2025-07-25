import {
  IChannel,
  IDiscussionsUser,
  Role,
} from "../../../../../src/discussions/api/types";
import { ChannelPermission } from "../../../../../src/discussions/api/utils/channel-permission";
import { deriveUserRoleV2 } from "../../../../../src/discussions/api/utils/channels/derive-user-role-v2";

describe("deriveUserRoleV2", () => {
  it("derive the user role for an anonymous user", () => {
    const channel = { orgId: "aaa", channelAcl: [] } as IChannel;
    const deriveUserRoleSpy = spyOn(
      ChannelPermission.prototype,
      "deriveUserRole"
    ).and.returnValue(Role.MANAGE);
    const results = deriveUserRoleV2(channel);
    expect(results).toEqual(Role.MANAGE);
    expect(deriveUserRoleSpy).toHaveBeenCalledTimes(1);
    expect(deriveUserRoleSpy).toHaveBeenCalledWith({});
  });
  it("derive the user role for an authenticated user", () => {
    const user = {} as IDiscussionsUser;
    const channel = { orgId: "aaa", channelAcl: [] } as IChannel;
    const deriveUserRoleSpy = spyOn(
      ChannelPermission.prototype,
      "deriveUserRole"
    ).and.returnValue(Role.MANAGE);
    const results = deriveUserRoleV2(channel, user);
    expect(results).toEqual(Role.MANAGE);
    expect(deriveUserRoleSpy).toHaveBeenCalledTimes(1);
    expect(deriveUserRoleSpy).toHaveBeenCalledWith(user);
  });
});
