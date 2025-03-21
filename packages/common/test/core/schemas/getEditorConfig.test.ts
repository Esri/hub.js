import { getEditorConfig } from "../../../src/core/schemas";
import type { IArcGISContext } from "../../../src";
import { EntityEditorOptions } from "../../../src/core/schemas/internal/EditorOptions";
import * as GetEntitySchemasModule from "../../../src/core/schemas/internal/getEditorSchemas";

describe("getEditorConfig:", () => {
  it("delegates to getEditorSchemas with entity", async () => {
    const getEditorSchemas = spyOn(
      GetEntitySchemasModule,
      "getEditorSchemas"
    ).and.callFake(() => {
      return Promise.resolve({ schema: {} } as any);
    });

    const chk = await getEditorConfig(
      "someScope",
      "hub:discussion:edit",
      {} as EntityEditorOptions,
      {} as any
    );

    expect(getEditorSchemas).toHaveBeenCalled();
    // verify that the options are passed to the schemas
    expect(getEditorSchemas).toHaveBeenCalledWith(
      "someScope",
      "hub:discussion:edit",
      {},
      {}
    );
    expect(chk).toBeDefined();
    expect(chk.schema).toBeDefined();
  });

  it("delegates to getEditorSchemas with card", async () => {
    const getEditorSchemas = spyOn(
      GetEntitySchemasModule,
      "getEditorSchemas"
    ).and.callFake(() => {
      return Promise.resolve({ schema: {} } as any);
    });

    const chk = await getEditorConfig(
      "someScope",
      "hub:card:stat",
      { themeColors: [] },
      {} as IArcGISContext
    );

    expect(getEditorSchemas).toHaveBeenCalled();
    // verify that the options are passed to the schemas
    expect(getEditorSchemas).toHaveBeenCalledWith(
      "someScope",
      "hub:card:stat",
      { themeColors: [] },
      {}
    );
    expect(chk).toBeDefined();
    expect(chk.schema).toBeDefined();
  });
});
