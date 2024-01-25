import { getCardEditorSchemas } from "../../../../src/core/schemas/internal/getCardEditorSchemas";
import * as filterSchemaModule from "../../../../src/core/schemas/internal/filterSchemaToUiSchema";
import { CardEditorType } from "../../../../src/core/schemas/types";

import * as statUiSchemaModule from "../../../../src/core/schemas/internal/metrics/StatCardUiSchema";
import * as followUiSchemaModule from "../../../../src/core/schemas/internal/follow/FollowUiSchema";

describe("getCardEditorSchemas", () => {
  let uiSchemaBuildFnSpy: any;
  afterEach(() => {
    uiSchemaBuildFnSpy.calls.reset();
  });

  [{ type: "hub:card:stat", buildFn: statUiSchemaModule }].forEach(
    async ({ type, buildFn }) => {
      it("returns a schema & uiSchema for a given card and card type", async () => {
        uiSchemaBuildFnSpy = spyOn(buildFn, "buildUiSchema").and.returnValue({
          type: "Layout",
        });
        const { schema, uiSchema } = await getCardEditorSchemas(
          "some.scope",
          type as CardEditorType,
          {} as any,
          {} as any
        );

        expect(uiSchemaBuildFnSpy).toHaveBeenCalledTimes(1);
        expect(schema).toBeDefined();
        expect(uiSchema).toEqual({ type: "Layout" });
      });
    }
  );
  it("filters the schemas to the uiSchema elements before returning", async () => {
    const filterSchemaToUiSchemaSpy = spyOn(
      filterSchemaModule,
      "filterSchemaToUiSchema"
    ).and.callThrough();
    uiSchemaBuildFnSpy = spyOn(
      statUiSchemaModule,
      "buildUiSchema"
    ).and.returnValue({});

    await getCardEditorSchemas(
      "some.scope",
      "hub:card:stat",
      {} as any,
      {} as any
    );

    expect(uiSchemaBuildFnSpy).toHaveBeenCalledTimes(1);
    expect(filterSchemaToUiSchemaSpy).toHaveBeenCalledTimes(1);
  });

  [{ type: "hub:card:follow", buildFn: followUiSchemaModule }].forEach(
    async ({ type, buildFn }) => {
      it("returns a schema & uiSchema for a given card and card type", async () => {
        uiSchemaBuildFnSpy = spyOn(buildFn, "buildUiSchema").and.returnValue({
          type: "Layout",
        });
        const { schema, uiSchema } = await getCardEditorSchemas(
          "some.scope",
          type as CardEditorType,
          {} as any,
          {} as any
        );

        expect(uiSchemaBuildFnSpy).toHaveBeenCalledTimes(1);
        expect(schema).toBeDefined();
        expect(uiSchema).toEqual({ type: "Layout" });
      });
    }
  );
  it("filters the schemas to the uiSchema elements before returning", async () => {
    const filterSchemaToUiSchemaSpy = spyOn(
      filterSchemaModule,
      "filterSchemaToUiSchema"
    ).and.callThrough();
    uiSchemaBuildFnSpy = spyOn(
      followUiSchemaModule,
      "buildUiSchema"
    ).and.returnValue({});

    await getCardEditorSchemas(
      "some.scope",
      "hub:card:follow",
      {} as any,
      {} as any
    );

    expect(uiSchemaBuildFnSpy).toHaveBeenCalledTimes(1);
    expect(filterSchemaToUiSchemaSpy).toHaveBeenCalledTimes(1);
  });
});
