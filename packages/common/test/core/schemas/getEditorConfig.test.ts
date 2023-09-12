import { getEditorConfig } from "../../../src";
import * as GetSchemasModule from "../../../src/core/schemas/internal/getEntityEditorSchemas";

describe("getEditorConfig:", () => {
  it("delegates", async () => {
    const getSchemasSpy = spyOn(
      GetSchemasModule,
      "getEntityEditorSchemas"
    ).and.callFake(() => {
      return Promise.resolve({ schema: {} } as any);
    });

    const chk = await getEditorConfig(
      "someScope",
      "hub:discussion:edit",
      {} as any,
      {} as any
    );

    expect(getSchemasSpy).toHaveBeenCalled();
    // verify that the options are passed to the schemas
    expect(getSchemasSpy).toHaveBeenCalledWith(
      "someScope",
      "hub:discussion:edit",
      {},
      {}
    );
    expect(chk).toBeDefined();
    expect(chk.schema).toBeDefined();
  });
});
