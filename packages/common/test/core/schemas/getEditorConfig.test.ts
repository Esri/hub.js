import { getEditorConfig } from "../../../src";
import * as GetEntitySchemasModule from "../../../src/core/schemas/internal/getEditorSchemas";

describe("getEditorConfig:", () => {
  it("delegates to getEditorSchemas", async () => {
    const getEditorSchemas = spyOn(
      GetEntitySchemasModule,
      "getEditorSchemas"
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
    expect(chk).toBeDefined();
    expect(chk.schema).toBeDefined();
  });
});
