import { applyProjectMigrations } from "../../../src/projects/_internal/projectMigrations";

import { IHubProject } from "../../../src/core/types/IHubProject";
import { HUB_PROJECT_CURRENT_SCHEMA_VERSION } from "../../../src/projects/defaults";

import * as migrateProjectSlugAndOrgUrlKeyModule from "../../../src/projects/_internal/migrateProjectSlugAndOrgUrlKey";

describe("projectMigrations", () => {
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
  });
});
