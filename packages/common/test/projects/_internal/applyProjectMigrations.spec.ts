import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from "vitest";
import { applyProjectMigrations } from "../../../src/projects/_internal/applyProjectMigrations";
import { IHubProject } from "../../../src/core/types/IHubProject";
import { HUB_PROJECT_CURRENT_SCHEMA_VERSION } from "../../../src/projects/defaults";
import * as migrateProjectSlugAndOrgUrlKeyModule from "../../../src/projects/_internal/migrateProjectSlugAndOrgUrlKey";
import * as timelineMigration from "../../../src/projects/_internal/migrateInvalidTimelineStages";
import { IHubStage } from "../../../src/core/types/IHubTimeline";

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
      const spy = vi.spyOn(
        migrateProjectSlugAndOrgUrlKeyModule,
        "migrateProjectSlugAndOrgUrlKey"
      );
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

    it("calls migrateInvalidTimelineStages and removes invalid stages", () => {
      const timelineMigrationSpy = vi.spyOn(
        timelineMigration,
        "migrateInvalidTimelineStages"
      );

      project.schemaVersion = 1.1;
      project.view = {
        timeline: {
          schemaVersion: 1.0,
          title: "Test Timeline",
          description: "A test timeline",
          canCollapse: true,
          stages: [
            {},
            { title: "Valid Stage" },
            { title: "" },
            { title: "Another Valid Stage" },
            { foo: "bar" },
          ] as IHubStage[],
        },
      };

      const result = applyProjectMigrations(project);

      expect(timelineMigrationSpy).toHaveBeenCalledWith(project);
      expect(result.view.timeline.stages).toEqual([
        { title: "Valid Stage" },
        { title: "Another Valid Stage" },
      ] as IHubStage[]);
    });
  });
});
