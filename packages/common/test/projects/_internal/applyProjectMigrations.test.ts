import { applyProjectMigrations } from "../../../src/projects/_internal/applyProjectMigrations";
import { IHubProject } from "../../../src/core/types/IHubProject";
import { HUB_PROJECT_CURRENT_SCHEMA_VERSION } from "../../../src/projects/defaults";

import * as migrateProjectSlugAndOrgUrlKeyModule from "../../../src/projects/_internal/migrateProjectSlugAndOrgUrlKey";

describe("applyProjectMigrations", () => {
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

  describe("applyProjectMigrations", () => {
    it("returns project unchanged if schemaVersion is current", () => {
      const currentProject = {
        ...project,
        schemaVersion: HUB_PROJECT_CURRENT_SCHEMA_VERSION,
      };
      const result = applyProjectMigrations(currentProject);
      expect(result).toBe(currentProject);
    });

    it("calls migrateProjectSlugAndOrgUrlKey if schemaVersion is outdated", () => {
      const spy = spyOn(
        migrateProjectSlugAndOrgUrlKeyModule,
        "migrateProjectSlugAndOrgUrlKey"
      ).and.callThrough();
      applyProjectMigrations(project);
      expect(spy).toHaveBeenCalledWith(project);
    });
    it("handles undefined typeKeywords", () => {
      const projectWithUndefinedTypeKeywords = {
        ...project,
      };
      delete projectWithUndefinedTypeKeywords.typeKeywords;
      const result = applyProjectMigrations(projectWithUndefinedTypeKeywords);
      expect(result.typeKeywords).toEqual(["slug|orgkey|test-slug"]);
    });
  });
});
