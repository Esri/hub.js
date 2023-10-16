import { getEditorConfig } from "../../../src";
import * as GetEntitySchemasModule from "../../../src/core/schemas/internal/getEntityEditorSchemas";
import * as GetCardSchemasModule from "../../../src/core/schemas/internal/getCardEditorSchemas";

describe("getEditorConfig:", () => {
  it("delegates to getEntityEditorSchemas", async () => {
    const getEntityEditorSchemas = spyOn(
      GetEntitySchemasModule,
      "getEntityEditorSchemas"
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

    expect(getEntityEditorSchemas).toHaveBeenCalled();
    // verify that the options are passed to the schemas
    expect(getEntityEditorSchemas).toHaveBeenCalledWith(
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
    const getEntityEditorSchemas = spyOn(
      GetEntitySchemasModule,
      "getEntityEditorSchemas"
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

    expect(getEntityEditorSchemas).not.toHaveBeenCalled();
    expect(chk).toBeDefined();
    expect(chk.schema).toBeDefined();
  });
});
