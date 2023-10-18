import { getEditorConfig } from "../../../src";
import * as GetEntitySchemasModule from "../../../src/core/schemas/internal/getEditorSchemas";
import * as GetCardSchemasModule from "../../../src/core/schemas/internal/getCardEditorSchemas";

describe("getEditorConfig:", () => {
  it("delegates to getEditorSchemas", async () => {
    const getEditorSchemas = spyOn(
      GetEntitySchemasModule,
      "getEditorSchemas"
    ).and.callFake(() => {
      return Promise.resolve({ schema: {} } as any);
    });

    const getCardEditorSchemas = spyOn(
      GetCardSchemasModule,
      "getCardEditorSchemas"
    ).and.callFake(() => {
      return Promise.resolve({ schema: {} } as any);
    });

    const chk = await getEditorConfig(
      "someScope",
      "hub:discussion:edit",
      {} as any,
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
    expect(getCardEditorSchemas).not.toHaveBeenCalled();
    expect(chk).toBeDefined();
    expect(chk.schema).toBeDefined();
  });

  it("delegates to getCardEditorSchemas", async () => {
    const getEditorSchemas = spyOn(
      GetEntitySchemasModule,
      "getEditorSchemas"
    ).and.callFake(() => {
      return Promise.resolve({ schema: {} } as any);
    });

    const getCardEditorSchemas = spyOn(
      GetCardSchemasModule,
      "getCardEditorSchemas"
    ).and.callFake(() => {
      return Promise.resolve({ schema: {} } as any);
    });

    const chk = await getEditorConfig(
      "someScope",
      "hub:card:stat",
      {} as any,
      {} as any
    );

    expect(getCardEditorSchemas).toHaveBeenCalled();
    // verify that the options are passed to the schemas
    expect(getCardEditorSchemas).toHaveBeenCalledWith(
      "someScope",
      "hub:card:stat",
      {},
      {}
    );

    expect(getEditorSchemas).not.toHaveBeenCalled();
    expect(chk).toBeDefined();
    expect(chk.schema).toBeDefined();
  });
});
