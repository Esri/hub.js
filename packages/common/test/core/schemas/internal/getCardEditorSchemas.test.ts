import { getCardEditorSchemas } from "../../../../src/core/schemas/internal/getCardEditorSchemas";
import * as filterSchemaModule from "../../../../src/core/schemas/internal/filterSchemaToUiSchema";
import {
  CardEditorType,
  IConfigurationSchema,
  IUiSchema,
} from "../../../../src/core/schemas/types";

import * as statUiSchemaModule from "../../../../src/core/schemas/internal/metrics/StatCardUiSchema";
import * as followUiSchemaModule from "../../../../src/core/schemas/internal/follow/FollowCardUiSchema";
import * as eventGalleryUiSchemaModule from "../../../../src/core/schemas/internal/events/EventGalleryCardUiSchema";
import * as embedUiSchemaModule from "../../../../src/core/schemas/internal/embed/EmbedUiSchema";
import { IArcGISContext } from "../../../../src";
import { EventGalleryCardEditorOptions } from "../../../../src/core/schemas/internal/EditorOptions";
import { EventGalleryCardSchema } from "../../../../src/core/schemas/internal/events/EventGalleryCardSchema";
import { EmbedCardSchema } from "../../../../src/core/schemas/internal/embed/EmbedSchema";

describe("getCardEditorSchemas", () => {
  let uiSchemaBuildFnSpy: jasmine.Spy;
  const context: IArcGISContext = {
    context: true,
  } as unknown as IArcGISContext;

  afterEach(() => {
    uiSchemaBuildFnSpy.calls.reset();
  });

  [{ type: "hub:card:stat", buildFn: statUiSchemaModule }].forEach(
    ({ type, buildFn }) => {
      it("returns a schema & uiSchema for a given card and card type", async () => {
        uiSchemaBuildFnSpy = spyOn(buildFn, "buildUiSchema").and.returnValue({
          type: "Layout",
        });
        const { schema, uiSchema } = await getCardEditorSchemas(
          "some.scope",
          type as CardEditorType,
          {},
          context
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

    await getCardEditorSchemas("some.scope", "hub:card:stat", {}, context);

    expect(uiSchemaBuildFnSpy).toHaveBeenCalledTimes(1);
    expect(filterSchemaToUiSchemaSpy).toHaveBeenCalledTimes(1);
  });

  [{ type: "hub:card:follow", buildFn: followUiSchemaModule }].forEach(
    ({ type, buildFn }) => {
      it("returns a schema & uiSchema for a given card and card type", async () => {
        uiSchemaBuildFnSpy = spyOn(buildFn, "buildUiSchema").and.returnValue({
          type: "Layout",
        });
        const { schema, uiSchema } = await getCardEditorSchemas(
          "some.scope",
          type as CardEditorType,
          {},
          context
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

    await getCardEditorSchemas("some.scope", "hub:card:follow", {}, context);

    expect(uiSchemaBuildFnSpy).toHaveBeenCalledTimes(1);
    expect(filterSchemaToUiSchemaSpy).toHaveBeenCalledTimes(1);
  });
  describe("eventGallery", () => {
    it("should build the eventGallery schema and ui schema", async () => {
      const options: EventGalleryCardEditorOptions = {
        tags: ["tag1", "tag2"],
      };
      const filteredSchema = {
        ...EventGalleryCardSchema,
        filtered: true,
      } as unknown as IConfigurationSchema;
      const uiSchema = { uiSchema: true } as unknown as IUiSchema;
      const filterSchemaToUiSchemaSpy = spyOn(
        filterSchemaModule,
        "filterSchemaToUiSchema"
      ).and.returnValue(filteredSchema);
      uiSchemaBuildFnSpy = spyOn(
        eventGalleryUiSchemaModule,
        "buildUiSchema"
      ).and.returnValue(uiSchema);

      const results = await getCardEditorSchemas(
        "some.scope",
        "hub:card:eventGallery",
        options,
        context
      );

      expect(uiSchemaBuildFnSpy).toHaveBeenCalledTimes(1);
      expect(uiSchemaBuildFnSpy).toHaveBeenCalledWith(
        "some.scope",
        options,
        context
      );
      expect(filterSchemaToUiSchemaSpy).toHaveBeenCalledTimes(1);
      expect(filterSchemaToUiSchemaSpy).toHaveBeenCalledWith(
        EventGalleryCardSchema,
        uiSchema
      );
      expect(results).toEqual({
        schema: filteredSchema,
        uiSchema,
        defaults: undefined,
      });
    });
  });
  describe("embed", () => {
    it("should build the embed schema and ui schema", async () => {
      const filteredSchema = {
        ...EmbedCardSchema,
        filtered: true,
      } as unknown as IConfigurationSchema;
      const uiSchema = { uiSchema: true } as unknown as IUiSchema;
      const filterSchemaToUiSchemaSpy = spyOn(
        filterSchemaModule,
        "filterSchemaToUiSchema"
      ).and.returnValue(filteredSchema);
      uiSchemaBuildFnSpy = spyOn(
        embedUiSchemaModule,
        "buildUiSchema"
      ).and.returnValue(uiSchema);

      const results = await getCardEditorSchemas(
        "",
        "hub:card:embed",
        {},
        context
      );

      expect(uiSchemaBuildFnSpy).toHaveBeenCalledTimes(1);
      expect(uiSchemaBuildFnSpy).toHaveBeenCalledWith("", {}, context);
      expect(filterSchemaToUiSchemaSpy).toHaveBeenCalledTimes(1);
      expect(filterSchemaToUiSchemaSpy).toHaveBeenCalledWith(
        EmbedCardSchema,
        uiSchema
      );
      expect(results).toEqual({
        schema: filteredSchema,
        uiSchema,
        defaults: { embeds: [] },
      });
    });
  });
});
