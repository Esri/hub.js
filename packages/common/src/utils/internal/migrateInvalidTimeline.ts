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
    if (stages.length === 1) {
      // if there is only one stage
      if (!stages[0].title) {
        // and it has no title, then we can just remove that stage
        // this is because we had a json schema validation issue
        // that allowed a single stage with no title
        clone.data.view.timeline.stages = [];
      }
    }

    // set the schema version
    if (!clone.item.properties) {
      clone.item.properties = {};
    }
    clone.item.properties.schemaVersion = targetSchemaVersion;

    return clone;
  }
}
