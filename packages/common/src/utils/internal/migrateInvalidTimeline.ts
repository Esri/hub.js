import { IModel } from "../../hub-types";
import { getProp } from "../../objects/get-prop";
import { cloneObject } from "../../util";

/**
 * Fix invalid timelines in the model
 * @param model
 * @param targetSchemaVersion - the schema version to set after migration
 * @returns migrated model
 */
export function migrateInvalidTimeline(
  model: IModel,
  targetSchemaVersion: number
): IModel {
  if (getProp(model, "item.properties.schemaVersion") >= targetSchemaVersion) {
    return model;
  } else {
    const clone = cloneObject(model);

    const stages = getProp(clone, "data.view.timeline.stages") || [];
    if (
      clone.data &&
      clone.data.view &&
      clone.data.view.timeline &&
      Array.isArray(stages)
    ) {
      // Remove any stage without a title
      clone.data.view.timeline.stages = stages.filter((stage) => !!stage.title);
    }

    // set the schema version
    if (!clone.item.properties) {
      clone.item.properties = {};
    }
    clone.item.properties.schemaVersion = targetSchemaVersion;

    return clone;
  }
}
