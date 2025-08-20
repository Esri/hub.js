import { buildUiSchema as buildCompactUiSchema } from "../../../../../src/core/schemas/internal/discussions/EntityUiSchemaDiscussionsSettingsCompact";
import * as buildUiSchemaUtils from "../../../../../src/core/schemas/internal/discussions/EntityUiSchemaDiscussionsSettings";
import { IHubDiscussion } from "../../../../../src/core/types/IHubDiscussion";
import { IArcGISContext } from "../../../../../src/types/IArcGISContext";

describe("EntityUiSchemaDiscussionsSettingsCompact", () => {
  it("calls buildUiSchema with 'compact' variant", async () => {
    const buildUiSchemaSpy = spyOn(
      buildUiSchemaUtils,
      "buildUiSchema"
    ).and.returnValue(Promise.resolve({ type: "Layout", elements: [] }));
    const entity: IHubDiscussion = { id: "31c" } as unknown as IHubDiscussion;
    const context: IArcGISContext = {
      hubLicense: "hub-premium",
      currentUser: {
        groups: [
          { id: "42b", title: "Group 1" },
          { id: "53a", title: "Group 2" },
        ],
      },
    } as unknown as IArcGISContext;
    const results = await buildCompactUiSchema("myI18nScope", entity, context);
    expect(buildUiSchemaSpy).toHaveBeenCalledWith(
      "myI18nScope",
      entity,
      context,
      "compact"
    );
    expect(results).toEqual({ type: "Layout", elements: [] });
  });
});
