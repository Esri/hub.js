import { IHubInitiative } from "../../core/types/IHubInitiative";
import { cloneObject } from "../../util";

export function migrateInvalidTimelineStages(
  initiative: IHubInitiative
): IHubInitiative {
  if (initiative.schemaVersion >= 2.2) {
    return initiative;
  }

  const clone = cloneObject(initiative);
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

  clone.schemaVersion = 2.2; // Update schema version to reflect migration

  return clone;
}
