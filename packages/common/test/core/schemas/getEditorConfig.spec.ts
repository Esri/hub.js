import { getEditorConfig } from "../../../src/core/schemas/getEditorConfig";
import type { IArcGISContext } from "../../../src/types/IArcGISContext";
import { EntityEditorOptions } from "../../../src/core/schemas/internal/EditorOptions";
import * as GetEntitySchemasModule from "../../../src/core/schemas/internal/getEditorSchemas";
import * as SiteSchemaModule from "../../../src/sites/_internal/SiteSchema";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import { vi } from "vitest";

describe("getEditorConfig:", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("delegates to getEditorSchemas with entity", async () => {
    const getEditorSchemas = vi
      .spyOn(GetEntitySchemasModule, "getEditorSchemas")
      .mockImplementation(() => Promise.resolve({ schema: {} } as any));

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

  it("gets site schemas", async () => {
    // spy but call through to the real implementation so that getSiteSchema is
    // invoked as in the original Jasmine test
    const originalGetEditorSchemas = GetEntitySchemasModule.getEditorSchemas;
    const getEditorSchemas = vi
      .spyOn(GetEntitySchemasModule, "getEditorSchemas")
      .mockImplementation((...args: any[]) =>
        originalGetEditorSchemas.apply(GetEntitySchemasModule, args)
      );

    const originalGetSiteSchema = SiteSchemaModule.getSiteSchema;
    const getSiteSchema = vi
      .spyOn(SiteSchemaModule, "getSiteSchema")
      .mockImplementation((...args: any[]) =>
        originalGetSiteSchema.apply(SiteSchemaModule, args)
      );

    const chk = await getEditorConfig(
      "someScope",
      "hub:site:create",
      {} as EntityEditorOptions,
      MOCK_CONTEXT
    );

    expect(getEditorSchemas).toHaveBeenCalled();
    // verify that the options are passed to the schemas
    expect(getEditorSchemas).toHaveBeenCalledWith(
      "someScope",
      "hub:site:create",
      {},
      MOCK_CONTEXT
    );
    expect(getSiteSchema).toHaveBeenCalled();
    expect(chk).toBeDefined();
    expect(chk.schema).toBeDefined();
    expect((chk.schema.properties.name as any).maxLength).toEqual(250);
  });

  it("delegates to getEditorSchemas with card", async () => {
    const getEditorSchemas = vi
      .spyOn(GetEntitySchemasModule, "getEditorSchemas")
      .mockImplementation(() => Promise.resolve({ schema: {} } as any));

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
