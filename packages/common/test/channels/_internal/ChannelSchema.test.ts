import { ChannelEditorTypes } from "../../../src/channels/_internal/channelEditorTypes";
import { ChannelSchema } from "../../../src/channels/_internal/ChannelSchema";

describe("ChannelSchema", () => {
  describe("ChannelEditorTypes", () => {
    it("should include the expected editor types", () => {
      expect(ChannelEditorTypes).toEqual([
        "hub:channel:create",
        "hub:channel:edit",
      ]);
    });
  });

  describe("ChannelSchema", () => {
    it("should define the expected schema", () => {
      expect(ChannelSchema).toEqual({
        type: "object",
        properties: {
          name: { type: "string" },
          blockWords: {
            type: "string",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            format: "blockWords",
          },
          publicConfigs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: { type: "string" },
                entityId: { type: "string" },
                entityType: { type: "string" },
                roles: {
                  type: "object",
                  properties: {
                    anonymous: {
                      type: "object",
                      properties: {
                        value: {
                          type: "string",
                          enum: ["hub:channel:none", "hub:channel:read"],
                          default: "hub:channel:none",
                        },
                        id: { type: "string" },
                      },
                    },
                    authenticated: {
                      type: "object",
                      properties: {
                        value: {
                          type: "string",
                          enum: [
                            "hub:channel:none",
                            "hub:channel:read",
                            "hub:channel:write",
                            "hub:channel:readWrite",
                          ],
                          default: "hub:channel:none",
                        },
                        id: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          orgConfigs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: { type: "string" },
                entityId: { type: "string" },
                entityType: { type: "string" },
                roles: {
                  type: "object",
                  properties: {
                    member: {
                      type: "object",
                      properties: {
                        value: {
                          type: "string",
                          enum: [
                            "hub:channel:none",
                            "hub:channel:read",
                            "hub:channel:write",
                            "hub:channel:readWrite",
                          ],
                          default: "hub:channel:none",
                        },
                        id: { type: "string" },
                      },
                    },
                    admin: {
                      type: "object",
                      properties: {
                        value: {
                          type: "string",
                          enum: ["hub:channel:owner"],
                          default: "hub:channel:owner",
                        },
                        id: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          groupConfigs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: { type: "string" },
                entityId: { type: "string" },
                entityType: { type: "string" },
                roles: {
                  type: "object",
                  properties: {
                    member: {
                      type: "object",
                      properties: {
                        value: {
                          type: "string",
                          enum: [
                            "hub:channel:none",
                            "hub:channel:read",
                            "hub:channel:write",
                            "hub:channel:readWrite",
                            "hub:channel:moderate",
                            "hub:channel:manage",
                            "hub:channel:owner",
                          ],
                          default: "hub:channel:none",
                        },
                        id: { type: "string" },
                      },
                    },
                    admin: {
                      type: "object",
                      properties: {
                        value: {
                          type: "string",
                          enum: [
                            "hub:channel:none",
                            "hub:channel:read",
                            "hub:channel:write",
                            "hub:channel:readWrite",
                            "hub:channel:moderate",
                            "hub:channel:manage",
                            "hub:channel:owner",
                          ],
                          default: "hub:channel:none",
                        },
                        id: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          userConfigs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: { type: "string" },
                entityId: { type: "string" },
                entityType: { type: "string" },
                roles: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object",
                      properties: {
                        value: {
                          type: "string",
                          enum: [
                            "hub:channel:none",
                            "hub:channel:read",
                            "hub:channel:readWrite",
                          ],
                          default: "hub:channel:none",
                        },
                        id: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          allowAsAnonymous: { type: "boolean", default: false },
        },
        required: ["name"],
      });
    });
  });
});
