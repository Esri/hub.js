import { initCatalogOnEntityCreate } from "../../src/search/initCatalogOnEntityCreate";
import * as getWellKnownGroupModule from "../../src/groups/getWellKnownGroup";
import * as createHubGroupModule from "../../src/groups/HubGroups";
import { CATALOG_SCHEMA_VERSION } from "../../src/search/upgradeCatalogSchema";
import { IArcGISContext } from "../../src/types/IArcGISContext";
import { IHubItemEntity } from "../../src/core/types/IHubItemEntity";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { CatalogSetupType } from "../../src/search/types/types";

describe("initCatalogOnEntityCreate", () => {
  afterEach(() => vi.restoreAllMocks());

  let context: IArcGISContext;
  let entity: IHubItemEntity;
  beforeEach(() => {
    context = {
      userRequestOptions: { token: "fake-token" },
      portal: { urlKey: "orgKey" },
    } as unknown as IArcGISContext;
    entity = { name: "Test Entity" } as IHubItemEntity;
  });

  it("returns catalog with existing groupId", async () => {
    const catalogSetup = {
      type: "existingGroup" as CatalogSetupType,
      groupId: ["group123"],
    };
    const result = await initCatalogOnEntityCreate(
      entity,
      catalogSetup,
      context
    );
    expect(result.schemaVersion).toBe(CATALOG_SCHEMA_VERSION);
    expect(result.scopes.item.filters[0].predicates[0].group).toEqual([
      "group123",
    ]);
    expect(result.scopes.event.filters[0].predicates[0].group).toEqual([
      "group123",
    ]);
    expect(result.collections).toEqual([]);
  });

  it("returns catalog with undefined groupId if not provided", async () => {
    const catalogSetup = { type: "existingGroup" as CatalogSetupType };
    const result = await initCatalogOnEntityCreate(
      entity,
      catalogSetup,
      context
    );
    expect(result.scopes.item.filters[0].predicates[0].group).toEqual([
      undefined,
    ]);
    expect(result.scopes.event.filters[0].predicates[0].group).toEqual([
      undefined,
    ]);
  });

  it("creates a new group and uses its id when type is newGroup", async () => {
    const getWellKnownGroupSpy = vi
      .spyOn(getWellKnownGroupModule as any, "getWellKnownGroup")
      .mockReturnValue({ foo: "bar" });
    const createHubGroupSpy = vi
      .spyOn(createHubGroupModule as any, "createHubGroup")
      .mockResolvedValue({ id: "newGroupId" });
    const catalogSetup = { type: "newGroup" as CatalogSetupType };
    const result = await initCatalogOnEntityCreate(
      entity,
      catalogSetup,
      context
    );
    expect(getWellKnownGroupSpy).toHaveBeenCalledWith("hubViewGroup", context);
    expect(createHubGroupSpy).toHaveBeenCalledWith(
      { foo: "bar", name: "Test Entity Content" },
      context
    );
    expect(result.scopes.item.filters[0].predicates[0].group).toEqual([
      "newGroupId",
    ]);
    expect(result.scopes.event.filters[0].predicates[0].group).toEqual([
      "newGroupId",
    ]);
  });
});
