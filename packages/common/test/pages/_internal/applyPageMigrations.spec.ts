import { applyPageMigrations } from "../../../src/pages/_internal/applyPageMigrations";
import * as migrateModule from "../../../src/pages/_internal/migratePageSlugAndOrgUrlKey";
import { describe, it, expect, afterEach, vi } from "vitest";
import { IHubPage } from "../../../src/core/types/IHubPage";
describe("applyPageMigrations", () => {
  afterEach(() => vi.restoreAllMocks());
  it("applies migratePageSlugAndOrgUrlKey", () => {
    const page: Partial<IHubPage> = { schemaVersion: 0 };
    function mockMigrator(p: IHubPage): IHubPage {
      const out: any = { ...(p as any), migrated: true };
      return out as IHubPage;
    }
    const spy = vi
      .spyOn(migrateModule, "migratePageSlugAndOrgUrlKey")
      .mockImplementation(mockMigrator as any);
    const result = applyPageMigrations(page as IHubPage);
    expect((result as any).migrated).toBe(true);
    spy.mockRestore();
  });
});
