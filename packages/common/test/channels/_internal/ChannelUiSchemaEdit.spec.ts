import { describe, it, expect, vi } from "vitest";
import { buildUiSchema } from "../../../src/channels/_internal/ChannelUiSchemaEdit";
import * as ChannelUiSchemaCreateModule from "../../../src/channels/_internal/ChannelUiSchemaCreate";
import { IArcGISContext } from "../../../src/types/IArcGISContext";
import { IUiSchema } from "../../../src/core/schemas/types";
import { IHubChannel } from "../../../src/core/types/IHubChannel";

describe("ChannelUiSchemaEdit", () => {
  describe("buildUiSchema", () => {
    const i18nScope = "myScope";
    const options: Partial<IHubChannel> = {};
    const context = {
      currentUser: {
        orgId: "orgId123",
        username: "user123",
      },
    } as unknown as IArcGISContext;

    it("should build an edit schema for a user who cannot edit the channel", async () => {
      const createSchema: IUiSchema = {
        type: "Layout",
        elements: [],
      };
      const buildUiSchemaCreateSpy = vi
        .spyOn(ChannelUiSchemaCreateModule, "buildUiSchema")
        .mockResolvedValue(createSchema);
      const expected: IUiSchema = {
        ...createSchema,
      };
      const result = await buildUiSchema(i18nScope, options, context);
      expect(result).toEqual(expected);
      expect(buildUiSchemaCreateSpy).toHaveBeenCalledTimes(1);
      expect(buildUiSchemaCreateSpy).toHaveBeenCalledWith(
        i18nScope,
        options,
        context
      );
    });

    it("should build an edit schema for a user who can edit the channel", async () => {
      const createSchema: IUiSchema = {
        type: "Layout",
        elements: [],
      };
      const buildUiSchemaCreateSpy = vi
        .spyOn(ChannelUiSchemaCreateModule, "buildUiSchema")
        .mockResolvedValue(createSchema);
      const expected: IUiSchema = {
        ...createSchema,
        elements: [
          {
            type: "Notice",
            options: {
              noticeId: "20250311-channel-edit-warning",
            },
          },
        ],
      };
      const result = await buildUiSchema(
        i18nScope,
        { ...options, canEdit: true },
        context
      );
      expect(result).toEqual(expected);
      expect(buildUiSchemaCreateSpy).toHaveBeenCalledTimes(1);
      expect(buildUiSchemaCreateSpy).toHaveBeenCalledWith(
        i18nScope,
        { ...options, canEdit: true },
        context
      );
    });
  });
});
