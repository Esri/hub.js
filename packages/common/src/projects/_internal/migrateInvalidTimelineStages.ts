/**
 * Remove any timeline stages without a title
 * @param project
 * @returns project with cleaned timeline
 */
import { IHubProject } from "../../core/types/IHubProject";
import { cloneObject } from "../../util";

export function migrateInvalidTimelineStages(
  project: IHubProject
): IHubProject {
  if (project.schemaVersion >= 1.2) {
    return project;
  }

  const clone = cloneObject(project);
  if (
    clone.view &&
    clone.view.timeline &&
    clone.view.timeline.stages &&
    Array.isArray(clone.view.timeline.stages)
  ) {
    clone.view.timeline.stages = clone.view.timeline.stages.filter(
      (stage: any) => !!stage.title
    );
  }

  clone.schemaVersion = 1.2; // Update schema version to reflect migration

  return clone;
}
