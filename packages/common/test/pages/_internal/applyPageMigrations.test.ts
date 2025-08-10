import { applyPageMigrations } from "../../../src/pages/_internal/applyPageMigrations";
import * as migrations from "../../../src/pages/_internal/migratePageSlugAndOrgUrlKey";
import { IHubPage } from "../../../src/core/types/IHubPage";
import { HUB_PAGE_CURRENT_SCHEMA_VERSION } from "../../../src/pages/defaults";

describe("applyPageMigrations", () => {
  let migrateSpy: jasmine.Spy;

  beforeEach(() => {
    migrateSpy = spyOn(migrations, "migratePageSlugAndOrgUrlKey").and.callFake(
      (page: IHubPage) => page
    );
  });

  it("returns page unchanged if schemaVersion is current", () => {
    const page: IHubPage = {
      schemaVersion: HUB_PAGE_CURRENT_SCHEMA_VERSION,
    } as IHubPage;
    const result = applyPageMigrations(page);
    expect(result).toBe(page);
    expect(migrateSpy).not.toHaveBeenCalled();
  });

  it("calls migratePageSlugAndOrgUrlKey if schemaVersion is not current", () => {
    const page: IHubPage = { schemaVersion: 1 } as IHubPage;
    const result = applyPageMigrations(page);
    expect(migrateSpy).toHaveBeenCalledWith(page);
    expect(result).toBe(page); // since our spy returns the input
  });
});
