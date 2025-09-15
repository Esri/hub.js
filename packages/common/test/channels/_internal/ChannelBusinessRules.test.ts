import { ChannelPermissions } from "../../../src/channels/_internal/ChannelPermissions";

describe("ChannelBusinessRules", () => {
  describe("ChannelPermissions", () => {
    it("should include the expected permissions", () => {
      expect(ChannelPermissions).toEqual([
        "hub:channel",
        "hub:channel:create",
        "hub:channel:delete",
        "hub:channel:edit",
        "hub:channel:view",
        "hub:channel:owner",
        "hub:channel:manage",
        "hub:channel:read",
        "hub:channel:write",
        "hub:channel:readWrite",
        "hub:channel:moderate",
      ]);
    });
  });
});
