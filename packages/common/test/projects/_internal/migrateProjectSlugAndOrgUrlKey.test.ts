import * as sharedMigrations from "../../../src/core/_internal/sharedMigrations";
import { IHubProject } from "../../../src/core/types/IHubProject";
import { migrateProjectSlugAndOrgUrlKey } from "../../../src/projects/_internal/migrateProjectSlugAndOrgUrlKey";

describe("migrateProjectSlugAndOrgUrlKey", () => {
  let project: IHubProject;

  beforeEach(() => {
    project = {
      schemaVersion: 1.0,
      slug: "Test-Slug",
      orgUrlKey: "ORGKEY",
      typeKeywords: ["keyword1"],
      // other required properties...
    } as IHubProject;
  });
  it("returns project unchanged if schemaVersion >= 1.1", () => {
    const migrated = migrateProjectSlugAndOrgUrlKey({
      ...project,
      schemaVersion: 1.1,
    });
    expect(migrated.schemaVersion).toBe(1.1);
    expect(migrated.slug).toBe(project.slug);
    expect(migrated.orgUrlKey).toBe(project.orgUrlKey);
  });
  it("returns project with updated slug and orgUrlKey if schemaVersion < 1.1", () => {
    const migrated = migrateProjectSlugAndOrgUrlKey(project);
    expect(migrated.schemaVersion).toBe(1.1);
    expect(migrated.slug).toBe("orgkey|test-slug");
    expect(migrated.orgUrlKey).toBe("orgkey");
    expect(migrated.typeKeywords).toContain("slug|orgkey|test-slug");
  });
  it("migrates slug and orgUrlKey and sets schemaVersion to 1.1", () => {
    const migrateSpy = spyOn(
      sharedMigrations,
      "migrateSlugAndOrgUrlKey"
    ).and.callFake((..._args: string[]) => ({
      slug: "new-slug",
      orgUrlKey: "new-orgurlkey",
      typeKeywords: ["new-keyword"],
    }));
    const migrated = migrateProjectSlugAndOrgUrlKey(project);
    expect(migrateSpy).toHaveBeenCalledWith(
      project.slug,
      project.orgUrlKey,
      project.typeKeywords
    );
    expect(migrated.slug).toBe("new-slug");
    expect(migrated.orgUrlKey).toBe("new-orgurlkey");
    expect(migrated.typeKeywords).toEqual(["new-keyword"]);
    expect(migrated.schemaVersion).toBe(1.1);
  });
});
