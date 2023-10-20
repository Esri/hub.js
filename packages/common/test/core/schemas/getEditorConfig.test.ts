import { getEditorConfig } from "../../../src/core/schemas";
import { IArcGISContext } from "../../../src/ArcGISContext";
import { EntityEditorOptions } from "../../../src/core/schemas/internal/EditorOptions";
import * as GetEntitySchemasModule from "../../../src/core/schemas/internal/getEditorSchemas";
import { HubEntity } from "../../../src/core/types/HubEntity";

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
      {} as HubEntity,
      {} as any
    );

    expect(getEditorSchemas).toHaveBeenCalled();
    // verify that the options are passed to the schemas
    expect(getEditorSchemas).toHaveBeenCalledWith(
      "someScope",
      "hub:discussion:edit",
      { type: "" },
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
