import { buildUiSchema } from "../../../src/channels/_internal/ChannelUiSchemaEdit";
import * as ChannelUiSchemaCreateModule from "../../../src/channels/_internal/ChannelUiSchemaCreate";
import { IChannel } from "../../../src/discussions/api/types";
import { IArcGISContext } from "../../../src/types/IArcGISContext";
import { IUiSchema } from "../../../src/core/schemas/types";

describe("ChannelUiSchemaEdit", () => {
  describe("buildUiSchema", () => {
    const i18nScope = "myScope";
    const options: Partial<IChannel> = {};
    const context = {
      currentUser: {
        orgId: "orgId123",
        username: "user123",
      },
    } as unknown as IArcGISContext;

    it("should return the schema from buildUiSchemaCreate", async () => {
      const expected: IUiSchema = {
        type: "Layout",
      };
      const buildUiSchemaCreateSpy = spyOn(
        ChannelUiSchemaCreateModule,
        "buildUiSchema"
      ).and.returnValue(expected);
      const result = await buildUiSchema(i18nScope, options, context);
      expect(result).toEqual(expected);
      expect(buildUiSchemaCreateSpy).toHaveBeenCalledTimes(1);
      expect(buildUiSchemaCreateSpy).toHaveBeenCalledWith(
        i18nScope,
        options,
        context
      );
    });
  });
});
